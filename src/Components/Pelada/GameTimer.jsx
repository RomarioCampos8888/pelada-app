import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Clock, AlertCircle, Pause, RotateCcw } from 'lucide-react';
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
  const [isPaused, setIsPaused] = useState(false);
  const [pausedStartTime, setPausedStartTime] = useState(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);
  const [adjustedEndTime, setAdjustedEndTime] = useState(endTime);

  useEffect(() => {
    setAdjustedEndTime(endTime);
  }, [endTime]);

  const handlePause = () => {
    if (!isPaused) {
      setPausedStartTime(new Date());
      setIsPaused(true);
    } else {
      if (pausedStartTime) {
        const pauseDuration = new Date() - pausedStartTime;
        setTotalPausedTime(prev => prev + pauseDuration);
        
        // Atualizar horário de fim da partida
        const newEndTime = new Date(adjustedEndTime);
        newEndTime.setMilliseconds(newEndTime.getMilliseconds() + pauseDuration);
        setAdjustedEndTime(newEndTime);
      }
      setIsPaused(false);
      setPausedStartTime(null);
    }
  };

  const formatPausedTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const playWhistle = () => {
    try {
      // Apito de futebol em base64
      const whistleAudio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
      whistleAudio.play().catch(() => {});
    } catch (e) {}
  };

  useEffect(() => {
    if (!isActive || !adjustedEndTime) return;

    const interval = setInterval(() => {
      if (isPaused) return;

      const now = new Date();
      const end = new Date(adjustedEndTime);
      const diff = end - now;
      
      if (diff <= 0) {
        setTimeRemaining(0);
        setIsTimeUp(true);
        playWhistle();
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining({ minutes, seconds });
        setIsTimeUp(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, adjustedEndTime, isPaused]);

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
            <div className={`rounded-xl p-3 ${isPaused ? 'bg-orange-50' : 'bg-slate-50'}`}>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Fim Previsto</p>
              <p className="text-lg font-bold text-slate-800">
                {adjustedEndTime ? format(new Date(adjustedEndTime), 'HH:mm') : '--:--'}
              </p>
            </div>
          </div>

          {totalPausedTime > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold">Tempo Total Pausado</p>
              <p className="text-xl font-bold text-blue-700">{formatPausedTime(totalPausedTime)}</p>
            </div>
          )}

          {timeRemaining !== null && (
            <motion.div
              animate={isTimeUp ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: isTimeUp ? Infinity : 0, duration: 0.5 }}
              className={`text-center py-4 rounded-xl ${
                isTimeUp 
                  ? 'bg-red-100 border-2 border-red-300' 
                  : isPaused
                  ? 'bg-orange-100 border-2 border-orange-300'
                  : 'bg-gradient-to-r from-emerald-50 to-indigo-50'
              }`}
            >
              {isTimeUp ? (
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <AlertCircle className="w-6 h-6" />
                  <span className="text-2xl font-bold">Tempo Esgotado!</span>
                </div>
              ) : isPaused ? (
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm text-orange-600 font-semibold">Partida Pausada</p>
                  <p className="text-3xl font-bold text-orange-700">
                    {String(timeRemaining.minutes).padStart(2, '0')}:
                    {String(timeRemaining.seconds).padStart(2, '0')}
                  </p>
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

          <div className="flex gap-2">
            <Button 
              onClick={handlePause}
              className={`flex-1 py-3 rounded-xl font-semibold ${
                isPaused
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Retomar
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pausar
                </>
              )}
            </Button>
            <Button 
              onClick={onEnd}
              variant="outline"
              className="flex-1 py-3 rounded-xl font-semibold border-2 border-slate-300 hover:bg-slate-100"
            >
              <Square className="w-4 h-4 mr-2" />
              Encerrar
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}