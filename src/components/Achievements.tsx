import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Zap, Calendar, Flame, CheckCircle2, Lock } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ACHIEVEMENTS = [
  { id: 'first_task', title: 'Primeros Pasos', description: 'Completa tu primera tarea', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100', reqTasks: 1 },
  { id: 'ten_tasks', title: 'Estudiante Dedicado', description: 'Completa 10 tareas', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-100', reqTasks: 10 },
  { id: 'fifty_tasks', title: 'Maestro Matemático', description: 'Completa 50 tareas', icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-100', reqTasks: 50 },
  { id: 'three_days', title: 'Racha de 3 Días', description: 'Estudia 3 días seguidos', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100', reqDays: 3 },
  { id: 'one_year', title: 'Leyenda Viva', description: 'Estudia durante un año entero', icon: Calendar, color: 'text-red-500', bg: 'bg-red-100', reqDays: 365 },
];

export function Achievements() {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [streakDays, setStreakDays] = useState(1); // Mocked for now, would need a daily login tracker
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(collection(db, 'taskCompletions'), where('studentId', '==', auth.currentUser.uid));
        const snapshot = await getDocs(q);
        setCompletedTasks(snapshot.size);
        // In a real app, calculate streak based on completedAt timestamps
        setStreakDays(Math.floor(Math.random() * 5) + 1); // Mock streak
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando logros...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm text-center">
        <div className="inline-flex p-4 rounded-full bg-brand-100 text-brand-600 mb-4">
          <Trophy size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Tus Logros</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Desbloquea recompensas completando tareas y manteniendo tu racha de estudio. ¡Sigue así!
        </p>
        
        <div className="flex justify-center gap-8 mt-8 pt-8 border-t border-slate-100">
          <div className="text-center">
            <p className="text-4xl font-black text-slate-900">{completedTasks}</p>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Tareas Completadas</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-orange-500 flex items-center justify-center gap-1">
              {streakDays} <Flame size={28} />
            </p>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">Días de Racha</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map(achievement => {
          const isUnlocked = 
            (achievement.reqTasks && completedTasks >= achievement.reqTasks) ||
            (achievement.reqDays && streakDays >= achievement.reqDays);
          
          const Icon = achievement.icon;

          return (
            <div 
              key={achievement.id} 
              className={`p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                isUnlocked 
                  ? 'bg-white border-brand-200 shadow-sm' 
                  : 'bg-slate-50 border-slate-100 opacity-75'
              }`}
            >
              <div className={`p-4 rounded-xl ${isUnlocked ? achievement.bg : 'bg-slate-200'} ${isUnlocked ? achievement.color : 'text-slate-400'}`}>
                {isUnlocked ? <Icon size={32} /> : <Lock size={32} />}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-slate-500">{achievement.description}</p>
                
                {!isUnlocked && (
                  <div className="mt-3 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-400 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, ((achievement.reqTasks ? completedTasks / achievement.reqTasks : streakDays / achievement.reqDays!) * 100))}%` 
                      }} 
                    />
                  </div>
                )}
              </div>
              {isUnlocked && (
                <div className="text-brand-500">
                  <CheckCircle2 size={24} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
