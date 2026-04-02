import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Plus, School, Play } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { MATH_DATA, TopicData } from '../types';
import { cn } from '../lib/utils';

interface StudentTasksProps {
  onTopicSelect: (topic: TopicData, taskId?: string) => void;
}

export function StudentTasks({ onTopicSelect }: StudentTasksProps) {
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [myClasses, setMyClasses] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;

    // Listen to classes where the student is enrolled
    const q = query(collection(db, 'classes'), where('studentIds', 'array-contains', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const classData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyClasses(classData);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  useEffect(() => {
    if (myClasses.length === 0) {
      setTasks([]);
      return;
    }

    const classIds = myClasses.map(c => c.id);
    // Firestore 'in' query supports up to 10 items. Assuming a student is in < 10 classes.
    const q = query(collection(db, 'tasks'), where('classId', 'in', classIds));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [myClasses]);

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || !auth.currentUser) return;
    setIsJoining(true);
    setError('');

    try {
      const q = query(collection(db, 'classes'), where('joinCode', '==', joinCode.trim().toUpperCase()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('Código de clase no encontrado.');
        setIsJoining(false);
        return;
      }

      const classDoc = snapshot.docs[0];
      const classRef = doc(db, 'classes', classDoc.id);

      // Add student to class
      await updateDoc(classRef, {
        studentIds: arrayUnion(auth.currentUser.uid),
        [`studentNames.${auth.currentUser.uid}`]: auth.currentUser.displayName || 'Alumno'
      });

      setJoinCode('');
    } catch (err) {
      console.error("Error joining class:", err);
      setError('Ocurrió un error al unirse a la clase.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleStartTask = (topicId: string, taskId: string) => {
    const topic = MATH_DATA.find(t => t.id === topicId);
    if (topic) {
      onTopicSelect(topic, taskId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <School className="text-brand-600" />
          Unirse a una Clase
        </h2>
        
        <form onSubmit={handleJoinClass} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1 w-full">
            <label className="text-sm font-bold text-slate-700 ml-1">Código de la clase</label>
            <input 
              required
              type="text" 
              value={joinCode}
              onChange={e => setJoinCode(e.target.value)}
              placeholder="Ej: A1B2C3"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-500 transition-all outline-none mt-2 font-mono uppercase"
            />
          </div>
          <button 
            type="submit" 
            disabled={isJoining || !joinCode.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isJoining ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus size={20} />
                Unirse
              </>
            )}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2 ml-1 font-medium">{error}</p>}

        {myClasses.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {myClasses.map(cls => (
              <span key={cls.id} className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-sm font-bold border border-brand-100">
                {cls.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <ClipboardList className="text-brand-600" />
          Tareas Pendientes
        </h2>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
              <ClipboardList size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">¡Todo al día!</h3>
              <p className="text-slate-500">No tienes tareas pendientes de tus profesores.</p>
            </div>
          ) : (
            tasks.map(task => {
              const topic = MATH_DATA.find(t => t.id === task.topicId);
              const className = myClasses.find(c => c.id === task.classId)?.name || 'Clase';
              
              return (
                <div key={task.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                        {className}
                      </span>
                      <span className="text-xs font-bold bg-brand-100 text-brand-700 px-2 py-1 rounded-md">
                        {topic?.title || 'Tema'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
                    {task.description && <p className="text-sm text-slate-500 mt-1">{task.description}</p>}
                  </div>
                  
                  <button 
                    onClick={() => handleStartTask(task.topicId, task.id)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-50 text-brand-600 font-bold rounded-xl hover:bg-brand-600 hover:text-white transition-colors shrink-0"
                  >
                    <Play size={18} />
                    Comenzar
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
}
