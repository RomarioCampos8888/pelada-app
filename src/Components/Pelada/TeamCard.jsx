import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield } from 'lucide-react';
import PlayerCard from './PlayerCard';

export default function TeamCard({ title, players, variant, onRemovePlayer, emptyMessage }) {
  const headerVariants = {
    teamA: 'from-emerald-500 to-emerald-600',
    teamB: 'from-indigo-500 to-indigo-600'
  };

  const bgVariants = {
    teamA: 'bg-emerald-50/50',
    teamB: 'bg-indigo-50/50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl overflow-hidden border border-slate-200 shadow-lg ${bgVariants[variant]}`}
    >
      <div className={`bg-gradient-to-r ${headerVariants[variant]} p-4`}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{title}</h3>
            <p className="text-white/80 text-sm">{players.length} jogadores</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <AnimatePresence mode="popLayout">
          {players.length > 0 ? (
            players.map((player, index) => (
              <PlayerCard
                key={player}
                player={player}
                variant={variant}
                index={index}
                onRemove={() => onRemovePlayer(player, index)}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-slate-400"
            >
              <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>{emptyMessage || 'Nenhum jogador'}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}