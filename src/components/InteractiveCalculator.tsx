import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Delete } from 'lucide-react';

interface InteractiveCalculatorProps {
  onClose: () => void;
}

export function InteractiveCalculator({ onClose }: InteractiveCalculatorProps) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handleInput = (val: string) => {
    setExpression(prev => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const calculate = () => {
    try {
      // Basic safe evaluation
      // eslint-disable-next-line no-new-func
      const evalResult = new Function('return ' + expression)();
      if (evalResult !== undefined && !Number.isNaN(evalResult)) {
        setResult(String(evalResult));
      } else {
        setResult('Error');
      }
    } catch (e) {
      setResult('Error');
    }
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-24 right-4 md:bottom-10 md:right-10 z-50 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
    >
      <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
        <span className="font-bold">Calculadora</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <div className="text-right text-slate-500 text-sm h-5 overflow-hidden">{expression}</div>
        <div className="text-right text-3xl font-bold text-slate-900 h-10 overflow-hidden">
          {result || expression || '0'}
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-4 gap-2 mb-2">
          <button onClick={handleClear} className="col-span-2 py-3 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-colors">AC</button>
          <button onClick={handleDelete} className="col-span-2 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors flex justify-center items-center"><Delete size={20} /></button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {buttons.map(btn => (
            <button
              key={btn}
              onClick={() => {
                if (btn === '=') calculate();
                else handleInput(btn);
              }}
              className={`py-3 font-bold rounded-xl transition-colors ${
                ['/', '*', '-', '+', '='].includes(btn)
                  ? 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
