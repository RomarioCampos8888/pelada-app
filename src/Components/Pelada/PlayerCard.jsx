import React from 'react';
import { motion } from 'framer-motion';
import { Minus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PlayerCard({ player, onRemove, variant = 'default', index = 0 }) {
  const variants = {
    teamA: 'bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-emerald-200',
    teamB: 'bg-gradient-to-r from-indigo-50 to-indigo-100/50 border-indigo-200',
    queue: 'bg-gradient-to-r from-slate-50 to-slate-100/50 border-slate-200',
    default: 'bg-white border-slate-200'
  };

  const iconVariants = {
    teamA: 'bg-emerald-500 text-white',
    teamB: 'bg-indigo-500 text-white',
    queue: 'bg-slate-400 text-white',
    default: 'bg-slate-300 text-white'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      className={`w-full flex items-center justify-between p-2 sm:p-3 rounded-xl border ${variants[variant]} backdrop-blur-sm`}
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${iconVariants[variant]}`}>
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <span className="font-medium text-slate-800 whitespace-nowrap md:truncate text-sm sm:text-base" title={player}>{player}</span>
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors shrink-0"
        >
          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      )}
    </motion.div>
  );
}