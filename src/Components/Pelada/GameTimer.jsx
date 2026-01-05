import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function GameTimer({ 
  duration, 
  isActive, 
  startTime, 
  endTime, 
  onStart, 
  onEnd 
}) {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (!isActive || !endTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end - now;
      
      if (diff <= 0) {
        setTimeRemaining(0);
        setIsTimeUp(true);
        // Play sound alert
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleV0zWr3v47RhGQo/k9bsrnpgMlu56eWvWxsLO5DT5aZxWjNZtuznq1kbCzyP0OChdFo2WLPo5KlXHQs7j87dnnRaN1ew5eGmVR4LO4/O3Z50WjdXsOXhplUeCzuPzt2edFo3V7Dl4aZVHgs7j87dnnRaN1ew5eGmVR4LOo7N25t0WjdXsOXhplUeCzqOzdubdFo3V7Dl4aZVHgs6js3bm3RaN1ew5eGmVR4LOo7N25t0WjdXsOThplUeCzqOzdubdFo3V7Dk4KVVHgs6js3bm3RaN1ew5N+lVR4LOo7N25t0WjdXsOTepFQeCzqOzdubdFo3V6/k3qRUHgs6js3bm3RaN1ev5N2jVB4MOo7N25t0WjdXr+TdolQeDDqOzdubdFo3V6/k3aJUHgw6js3bm3RaN1ev5N2iVB4MOo7N25t0WjdXr+TcolQeDDqOzdubdFo3V6/k3KFUHgw6js3bm3RaN1ev5NugUx4MOY3M2pt0WTZWruPboFMeDDmNzNqbdFk2Vq7j2qBTHgw5jczam3RZNlau49qgUx4MOY3M2pt0WTZWruPaoFMeDDmNzNqbdFk2Vq7j2Z9THgw5jczam3RZNlau49mfUx4MOY3M2pt0WTZWruPZn1MeDDmNzNqbdFk2Vq7j2Z9THgw5jczam3RZNlau49mfUx4MOY3M2pt0WTZWruPZn1MeDDmNzNqbdFk2Vq7j2Z9THgw=');
          audio.play().catch(() => {});
        } catch (e) {}
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining({ minutes, seconds });
        setIsTimeUp(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, endTime]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-amber-100 rounded-full p-2">
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Tempo da Partida</h3>
      </div>

      {!isActive ? (
        <div className="text-center py-4">
          <p className="text-slate-500 mb-4">Duração: {duration} minutos</p>
          <Button 
            onClick={onStart}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold"
          >
            <Play className="w-5 h-5 mr-2" />
            Iniciar Partida
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Início</p>
              <p className="text-lg font-bold text-slate-800">
                {startTime ? format(new Date(startTime), 'HH:mm') : '--:--'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Fim Previsto</p>
              <p className="text-lg font-bold text-slate-800">
                {endTime ? format(new Date(endTime), 'HH:mm') : '--:--'}
              </p>
            </div>
          </div>

          {timeRemaining !== null && (
            <motion.div
              animate={isTimeUp ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: isTimeUp ? Infinity : 0, duration: 0.5 }}
              className={`text-center py-4 rounded-xl ${
                isTimeUp 
                  ? 'bg-red-100 border-2 border-red-300' 
                  : 'bg-gradient-to-r from-emerald-50 to-indigo-50'
              }`}
            >
              {isTimeUp ? (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <AlertCircle className="w-6 h-6" />
                  <span className="text-2xl font-bold">Tempo Esgotado!</span>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 mb-1">Tempo Restante</p>
                  <p className="text-4xl font-bold text-slate-800">
                    {String(timeRemaining.minutes).padStart(2, '0')}:
                    {String(timeRemaining.seconds).padStart(2, '0')}
                  </p>
                </>
              )}
            </motion.div>
          )}

          <Button 
            onClick={onEnd}
            variant="outline"
            className="w-full py-3 rounded-xl font-semibold border-2 border-slate-300 hover:bg-slate-100"
          >
            <Square className="w-4 h-4 mr-2" />
            Encerrar Partida
          </Button>
        </div>
      )}
    </motion.div>
  );
}