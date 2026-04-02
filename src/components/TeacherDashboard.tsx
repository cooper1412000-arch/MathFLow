import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { School, Plus, Users, ClipboardList, Copy, Check, ChevronRight, X } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, onSnapshot, serverTimestamp, arrayRemove } from 'firebase/firestore';
import { MATH_DATA } from '../types';
import { cn } from '../lib/utils';

export function TeacherDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskCompletions, setTaskCompletions] = useState<any[]>([]);
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', topicId: '' });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const q = query(collection(db, 'classes'), where('teacherId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const classData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClasses(classData);
      if (selectedClass) {
        const updatedSelected = classData.find(c => c.id === selectedClass.id);
        if (updatedSelected) setSelectedClass(updatedSelected);
      }
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  useEffect(() => {
    if (!selectedClass) return;

    const q = query(collection(db, 'tasks'), where('classId', '==', selectedClass.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [selectedClass]);

  useEffect(() => {
    if (tasks.length === 0) {
      setTaskCompletions([]);
      return;
    }
    const taskIds = tasks.map(t => t.id);
    // Firestore 'in' query supports up to 10 items.
    // For a real app with many tasks, you'd need to batch this or fetch differently.
    // For now, we'll slice to 10 to avoid errors if there are many tasks.
    const q = query(collection(db, 'taskCompletions'), where('taskId', 'in', taskIds.slice(0, 10)));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTaskCompletions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [tasks]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !auth.currentUser) return;

    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    try {
      await addDoc(collection(db, 'classes'), {
        name: newClassName.trim(),
        teacherId: auth.currentUser.uid,
        joinCode,
        studentIds: [],
        studentNames: {},
        createdAt: serverTimestamp()
      });
      setNewClassName('');
      setIsCreatingClass(false);
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.topicId || !selectedClass || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        classId: selectedClass.id,
        teacherId: auth.currentUser.uid,
        topicId: newTask.topicId,
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        createdAt: serverTimestamp()
      });
      setNewTask({ title: '', description: '', topicId: '' });
      setIsAssigningTask(false);
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!selectedClass) return;
    try {
      const classRef = doc(db, 'classes', selectedClass.id);
      await updateDoc(classRef, {
        studentIds: arrayRemove(studentId)
      });
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  if (selectedClass) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedClass(null)}
            className="text-brand-600 font-bold hover:underline"
          >
            &larr; Volver a mis clases
          </button>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{selectedClass.name}</h2>
              <p className="text-slate-500 mt-1">
                {selectedClass.studentIds?.length || 0} alumnos unidos
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Código de clase</p>
                <p className="text-2xl font-mono font-bold text-brand-600">{selectedClass.joinCode}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(selectedClass.joinCode)}
                className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm"
              >
                {copiedCode === selectedClass.joinCode ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tareas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardList className="text-brand-600" />
                  Tareas Asignadas
                </h3>
                <button 
                  onClick={() => setIsAssigningTask(!isAssigningTask)}
                  className="p-2 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              {isAssigningTask && (
                <form onSubmit={handleAssignTask} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 ml-1">Título de la tarea</label>
                    <input 
                      required
                      type="text" 
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Ej: Repaso de fracciones"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-brand-500 outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 ml-1">Tema a practicar</label>
                    <select 
                      required
                      value={newTask.topicId}
                      onChange={e => setNewTask({...newTask, topicId: e.target.value})}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-brand-500 outline-none mt-1"
                    >
                      <option value="">Selecciona un tema...</option>
                      {MATH_DATA.map(topic => (
                        <option key={topic.id} value={topic.id}>{topic.courseLevel} - {topic.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 ml-1">Descripción (opcional)</label>
                    <textarea 
                      value={newTask.description}
                      onChange={e => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Instrucciones para los alumnos..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-brand-500 outline-none mt-1 resize-none h-20"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAssigningTask(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl">Cancelar</button>
                    <button type="submit" className="px-4 py-2 text-sm font-bold bg-brand-600 text-white rounded-xl hover:bg-brand-700">Asignar</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-slate-500 text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">No hay tareas asignadas aún.</p>
                ) : (
                  tasks.map(task => {
                    const completions = taskCompletions.filter(c => c.taskId === task.id);
                    return (
                      <div key={task.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900">{task.title}</h4>
                          <span className="text-xs font-bold bg-brand-100 text-brand-700 px-2 py-1 rounded-md">
                            {MATH_DATA.find(t => t.id === task.topicId)?.title || 'Tema'}
                          </span>
                        </div>
                        {task.description && <p className="text-sm text-slate-500">{task.description}</p>}
                        
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                            Completado por {completions.length} / {selectedClass.studentIds?.length || 0} alumnos
                          </p>
                          {completions.length > 0 && (
                            <div className="space-y-1">
                              {completions.map(comp => (
                                <div key={comp.id} className="flex justify-between items-center text-sm">
                                  <span className="text-slate-700 font-medium">
                                    {selectedClass.studentNames?.[comp.studentId] || 'Alumno'}
                                  </span>
                                  <span className="text-brand-600 font-bold">
                                    {comp.score} / {comp.total}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Alumnos */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Users className="text-brand-600" />
                Alumnos
              </h3>
              <div className="space-y-3">
                {!selectedClass.studentIds || selectedClass.studentIds.length === 0 ? (
                  <p className="text-slate-500 text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    Comparte el código <strong>{selectedClass.joinCode}</strong> con tus alumnos para que se unan.
                  </p>
                ) : (
                  selectedClass.studentIds.map((studentId: string) => (
                    <div key={studentId} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                          {selectedClass.studentNames?.[studentId]?.[0] || 'A'}
                        </div>
                        <span className="font-bold text-slate-700">
                          {selectedClass.studentNames?.[studentId] || 'Alumno Desconocido'}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleRemoveStudent(studentId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Expulsar alumno"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <School className="text-brand-600" />
          Mis Clases
        </h2>
        <button 
          onClick={() => setIsCreatingClass(!isCreatingClass)}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nueva Clase
        </button>
      </div>

      {isCreatingClass && (
        <form onSubmit={handleCreateClass} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Nombre de la clase</label>
            <input 
              required
              type="text" 
              value={newClassName}
              onChange={e => setNewClassName(e.target.value)}
              placeholder="Ej: Matemáticas 4ºA"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-500 transition-all outline-none mt-2"
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700">
            Crear
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-[32px] border border-slate-200 border-dashed">
            <School size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Aún no tienes clases</h3>
            <p className="text-slate-500">Crea tu primera clase para invitar a tus alumnos.</p>
          </div>
        ) : (
          classes.map(cls => (
            <div 
              key={cls.id} 
              onClick={() => setSelectedClass(cls)}
              className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{cls.name}</h3>
                <ChevronRight className="text-slate-400 group-hover:text-brand-600 transition-colors" />
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Users size={16} />
                  {cls.studentIds?.length || 0} alumnos
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    {cls.joinCode}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
