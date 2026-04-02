import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw, ChevronLeft, Activity } from 'lucide-react';
import { Exercise, TopicData } from '../types';
import { MathRenderer } from './MathRenderer';
import { cn } from '../lib/utils';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ExerciseSessionProps {
  topic: TopicData;
  onExit: () => void;
  taskId?: string;
}

export function ExerciseSession({ topic, onExit, taskId }: ExerciseSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [numericAnswer, setNumericAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentExercise = topic.exercises[currentIndex];

  const handleCheck = () => {
    const answer = currentExercise.type === 'multiple-choice' ? selectedAnswer : numericAnswer;
    const correct = answer?.trim() === currentExercise.correctAnswer.trim();
    
    setIsCorrect(correct);
    setShowExplanation(true);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentIndex < topic.exercises.length - 1) {
      setCurrentIndex(i => i + 1);
      resetState();
    } else {
      setCompleted(true);
      if (taskId && auth.currentUser) {
        addDoc(collection(db, 'taskCompletions'), {
          taskId,
          studentId: auth.currentUser.uid,
          score: score,
          total: topic.exercises.length,
          completedAt: serverTimestamp()
        }).catch(err => console.error("Error saving task completion:", err));
      }
    }
  };

  const resetState = () => {
    setSelectedAnswer(null);
    setNumericAnswer('');
    setIsCorrect(null);
    setShowExplanation(false);
  };

  if (completed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center py-12"
      >
        <div className="mb-6 inline-flex p-4 rounded-full bg-brand-100 text-brand-600">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">¡Práctica completada!</h2>
        <p className="text-slate-500 mb-8">Has terminado la sesión de {topic.title}.</p>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="text-5xl font-bold text-brand-600 mb-2">
            {score} / {topic.exercises.length}
          </div>
          <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Puntuación final</div>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={onExit}
            className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 transition-colors"
          >
            Volver al inicio
          </button>
          <button 
            onClick={() => {
              setCompleted(false);
              setCurrentIndex(0);
              setScore(0);
              resetState();
            }}
            className="px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors flex items-center gap-2"
          >
            <RefreshCcw size={18} />
            Repetir práctica
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onExit}
          className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-1 text-sm font-medium"
        >
          <ChevronLeft size={18} />
          Abandonar
        </button>
        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Ejercicio {currentIndex + 1} de {topic.exercises.length}
          </div>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / topic.exercises.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentExercise.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm"
        >
          <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed">
              <MathRenderer math={currentExercise.question} />
            </h2>
          </div>

          <div className="space-y-4 mb-10">
            {currentExercise.type === 'multiple-choice' ? (
              currentExercise.options?.map((option, idx) => (
                <button
                  key={idx}
                  disabled={isCorrect !== null}
                  onClick={() => setSelectedAnswer(option)}
                  className={cn(
                    "w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group",
                    selectedAnswer === option 
                      ? "border-brand-500 bg-brand-50/50" 
                      : "border-slate-100 hover:border-slate-200 bg-white",
                    isCorrect !== null && option === currentExercise.correctAnswer && "border-green-500 bg-green-50",
                    isCorrect === false && selectedAnswer === option && "border-red-500 bg-red-50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold transition-colors",
                      selectedAnswer === option ? "bg-brand-500 border-brand-500 text-white" : "border-slate-200 text-slate-400 group-hover:border-slate-300"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-lg text-slate-700">
                      <MathRenderer math={option} />
                    </span>
                  </div>
                  {isCorrect !== null && option === currentExercise.correctAnswer && (
                    <CheckCircle2 className="text-green-500" size={24} />
                  )}
                  {isCorrect === false && selectedAnswer === option && (
                    <XCircle className="text-red-500" size={24} />
                  )}
                </button>
              ))
            ) : (
              <div className="relative">
                <input 
                  type="text"
                  value={numericAnswer}
                  disabled={isCorrect !== null}
                  onChange={(e) => setNumericAnswer(e.target.value)}
                  placeholder="Introduce tu respuesta..."
                  className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-brand-500 focus:ring-0 transition-all text-lg font-mono"
                />
                {isCorrect !== null && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    {isCorrect ? <CheckCircle2 className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            {isCorrect === null ? (
              <button
                disabled={currentExercise.type === 'multiple-choice' ? !selectedAnswer : !numericAnswer}
                onClick={handleCheck}
                className="px-8 py-4 rounded-2xl bg-brand-600 text-white font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-200"
              >
                Comprobar
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                Siguiente
                <ArrowRight size={20} />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8 pt-8 border-t border-slate-100"
              >
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="mt-1 text-brand-600">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Explicación</h4>
                    <p className="text-slate-600 leading-relaxed">
                      <MathRenderer math={currentExercise.explanation} />
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
