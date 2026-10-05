import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PlayerCard from './PlayerCard';

export default function QueueSection({ 
  queue, 
  playersPerTeam, 
  onAddPlayer, 
  onRemovePlayer 
}) {
  const [newPlayer, setNewPlayer] = useState('');
  const inputRef = useRef(null);

  const handleAddPlayer = (event) => {
    event.preventDefault();
    if (newPlayer.trim()) {
      onAddPlayer(newPlayer.trim());
      setNewPlayer('');
      inputRef.current?.focus();
    }
  };

  // Dividir fila em blocos do tamanho de um time
  const blocks = [];
  for (let i = 0; i < queue.length; i += playersPerTeam) {
    blocks.push(queue.slice(i, i + playersPerTeam));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-white/20 rounded-full p-1.5 sm:p-2">
            <Users className="w-4 h-4 text-white sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg">Fila de Espera</h3>
            <p className="text-white/80 text-xs sm:text-sm">{queue.length} jogadores aguardando</p>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Adicionar jogador */}
        <form onSubmit={handleAddPlayer} className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            aria-label="Nome do jogador para adicionar à fila"
            placeholder="Nome do jogador..."
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            className="min-h-11 flex-1 rounded-xl border-slate-200"
          />
          <Button
            type="submit"
            aria-label="Adicionar jogador à fila"
            className="min-h-11 min-w-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl px-3 sm:px-4"
          >
            <UserPlus className="w-5 h-5" />
          </Button>
        </form>

        {/* Blocos da fila */}
        <div className="space-y-4">
          <AnimatePresence>
            {blocks.length > 0 ? (
              blocks.map((block, blockIndex) => (
                <motion.div
                  key={blockIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: blockIndex * 0.1 }}
                  className="bg-slate-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3"
                >
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    {blockIndex + 1}º Próximos a entrar
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {block.map((player, playerIndex) => (
                      <div key={player} className="basis-[calc(50%-0.1875rem)] min-w-0">
                        <PlayerCard
                          player={player}
                          variant="queue"
                          index={playerIndex}
                          onRemove={() => onRemovePlayer(blockIndex * playersPerTeam + playerIndex)}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-slate-400"
              >
                <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>Fila vazia</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}