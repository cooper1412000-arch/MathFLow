import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, Variable, Triangle, Activity, Calculator, LayoutGrid } from 'lucide-react';
import { TopicData } from '../types';
import { cn } from '../lib/utils';

const iconMap: Record<string, LucideIcon> = {
  Variable,
  Triangle,
  Activity,
  Calculator,
  LayoutGrid
};

interface TopicCardProps {
  topic: TopicData;
  onClick: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  const Icon = iconMap[topic.icon] || Calculator;

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-start p-6 text-left transition-all duration-300",
        "bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md",
        "group"
      )}
    >
      <div className="p-3 mb-4 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{topic.title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{topic.description}</p>
      <div className="mt-4 flex items-center text-xs font-medium text-brand-600">
        Comenzar práctica
        <motion.span 
          initial={{ x: 0 }}
          animate={{ x: 4 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.6 }}
          className="ml-1"
        >
          →
        </motion.span>
      </div>
    </motion.button>
  );
};
