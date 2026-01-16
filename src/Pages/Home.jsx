import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  FileText, 
  Settings, 
  Play, 
  Trophy,
  ArrowLeft,
  Shuffle,
  Minus,
  Clock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

import TeamCard from '@/Components/Pelada/TeamCard';
import PlayerCard from '@/Components/Pelada/PlayerCard';
import GameTimer from '@/Components/Pelada/GameTimer';
import QueueSection from '@/Components/Pelada/QueueSection';
import ConfirmDialog from '@/Components/Pelada/ConfirmDialog';

// Carregar do localStorage
const loadFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export default function Home() {
  // Estado principal
  const [screen, setScreen] = useState(() => loadFromStorage('pelada_screen', 1));
  
  // Cadastro
  const [players, setPlayers] = useState(() => loadFromStorage('pelada_players', []));
  const [newPlayer, setNewPlayer] = useState('');
  const [importList, setImportList] = useState('');
  const [playersPerTeam, setPlayersPerTeam] = useState(() => loadFromStorage('pelada_playersPerTeam', 4));
  const [matchDuration, setMatchDuration] = useState(() => loadFromStorage('pelada_matchDuration', 7));
  
  // Partida
  const [teamA, setTeamA] = useState(() => loadFromStorage('pelada_teamA', []));
  const [teamB, setTeamB] = useState(() => loadFromStorage('pelada_teamB', []));
  const [queue, setQueue] = useState(() => loadFromStorage('pelada_queue', []));
  const [isMatchActive, setIsMatchActive] = useState(() => loadFromStorage('pelada_isMatchActive', false));
  const [startTime, setStartTime] = useState(() => loadFromStorage('pelada_startTime', null));
  const [endTime, setEndTime] = useState(() => loadFromStorage('pelada_endTime', null));
  
  // Confirmação de remoção
  const [confirmRemove, setConfirmRemove] = useState(null);
  
  // Resultado
  const [resultType, setResultType] = useState('draw');
  const [winner, setWinner] = useState('teamA');
  const [preference, setPreference] = useState('teamA');

  // Salvar no localStorage sempre que os estados mudarem
  useEffect(() => {
    localStorage.setItem('pelada_screen', JSON.stringify(screen));
  }, [screen]);

  useEffect(() => {
    localStorage.setItem('pelada_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('pelada_playersPerTeam', JSON.stringify(playersPerTeam));
  }, [playersPerTeam]);

  useEffect(() => {
    localStorage.setItem('pelada_matchDuration', JSON.stringify(matchDuration));
  }, [matchDuration]);

  useEffect(() => {
    localStorage.setItem('pelada_teamA', JSON.stringify(teamA));
  }, [teamA]);

  useEffect(() => {
    localStorage.setItem('pelada_teamB', JSON.stringify(teamB));
  }, [teamB]);

  useEffect(() => {
    localStorage.setItem('pelada_queue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('pelada_isMatchActive', JSON.stringify(isMatchActive));
  }, [isMatchActive]);

  useEffect(() => {
    localStorage.setItem('pelada_startTime', JSON.stringify(startTime));
  }, [startTime]);

  useEffect(() => {
    localStorage.setItem('pelada_endTime', JSON.stringify(endTime));
  }, [endTime]);

  // Funções de utilidade
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const distributeInitial = () => {
    const shuffled = shuffleArray(players);
    const newTeamA = shuffled.slice(0, playersPerTeam);
    const newTeamB = shuffled.slice(playersPerTeam, playersPerTeam * 2);
    const newQueue = shuffled.slice(playersPerTeam * 2);
    
    setTeamA(newTeamA);
    setTeamB(newTeamB);
    setQueue(newQueue);
    setScreen(2);
    toast.success('Times organizados com sucesso!');
  };

  const replenishTeam = (team, setTeam, index = null) => {
    if (queue.length === 0) return;
    
    const [substitute, ...restQueue] = queue;
    setQueue(restQueue);
    
    if (index !== null) {
      const newTeam = [...team];
      newTeam[index] = substitute;
      setTeam(newTeam);
    } else {
      const newTeam = queue.slice(0, playersPerTeam);
      setQueue(queue.slice(playersPerTeam));
      setTeam(newTeam);
    }
  };

  const handleRemovePlayer = (player, team, index) => {
    setConfirmRemove({ player, team, index });
  };

  const confirmRemovePlayer = () => {
    if (!confirmRemove) return;
    
    const { player, team, index } = confirmRemove;
    
    // Pegar o próximo da fila
    if (queue.length === 0) {
      toast.error('Não há jogadores na fila para substituição!');
      setConfirmRemove(null);
      return;
    }
    
    const [substitute, ...restQueue] = queue;
    
    // Substituir no time e colocar o removido no final da fila
    if (team === 'teamA') {
      const newTeam = [...teamA];
      newTeam[index] = substitute;
      setTeamA(newTeam);
    } else {
      const newTeam = [...teamB];
      newTeam[index] = substitute;
      setTeamB(newTeam);
    }
    
    // Jogador removido vai para o final da fila
    setQueue([...restQueue, player]);
    
    setConfirmRemove(null);
    toast.success(`${substitute} entrou no lugar de ${player}!`);
  };

  const handleStartMatch = () => {
    const now = new Date();
    const end = new Date(now.getTime() + matchDuration * 60000);
    setStartTime(now.toISOString());
    setEndTime(end.toISOString());
    setIsMatchActive(true);
    toast.success('Partida iniciada!');
  };

  const handleEndMatch = () => {
    setIsMatchActive(false);
    setScreen(3);
  };

  const handleConfirmResult = () => {
    if (resultType === 'draw') {
      // Verificar se há 2 ou mais times completos na fila
      const totalPlayersNeeded = playersPerTeam * 2;
      
      if (queue.length >= totalPlayersNeeded) {
        // Há jogadores suficientes para formar 2 novos times
        // Ambas as equipes vão para a fila, mas a não preferida vai por último
        let updatedQueue;
        if (preference === 'teamA') {
          // Time A tem preferência, então Time B vai por último
          updatedQueue = [...queue, ...teamA, ...teamB];
        } else {
          // Time B tem preferência, então Time A vai por último
          updatedQueue = [...queue, ...teamB, ...teamA];
        }
        
        // Formar dois novos times da fila
        const newTeamA = updatedQueue.slice(0, playersPerTeam);
        const newTeamB = updatedQueue.slice(playersPerTeam, playersPerTeam * 2);
        const remainingQueue = updatedQueue.slice(playersPerTeam * 2);
        
        setTeamA(newTeamA);
        setTeamB(newTeamB);
        setQueue(remainingQueue);
        toast.success('Empate! Dois novos times formados da fila.');
      } else {
        // Não há jogadores suficientes, apenas substitui o time sem preferência
        if (preference === 'teamA') {
          // Time B vai para o final da fila
          const updatedQueue = [...queue, ...teamB];
          // Próximos da fila formam o novo Time B
          const newTeamB = updatedQueue.slice(0, playersPerTeam);
          const remainingQueue = updatedQueue.slice(playersPerTeam);
          setTeamB(newTeamB);
          setQueue(remainingQueue);
        } else {
          // Time A vai para o final da fila
          const updatedQueue = [...queue, ...teamA];
          // Próximos da fila formam o novo Time A
          const newTeamA = updatedQueue.slice(0, playersPerTeam);
          const remainingQueue = updatedQueue.slice(playersPerTeam);
          setTeamA(newTeamA);
          setQueue(remainingQueue);
        }
        toast.success('Empate registrado! Time reorganizado.');
      }
    } else {
      // Vitória - mover o time perdedor (o oposto do selecionado como vencedor) para a fila
      if (winner === 'teamA') {
        // Time B (perdedor) vai para o final da fila
        const updatedQueue = [...queue, ...teamB];
        // Próximos da fila formam o novo Time B
        const newTeamB = updatedQueue.slice(0, playersPerTeam);
        const remainingQueue = updatedQueue.slice(playersPerTeam);
        setTeamB(newTeamB);
        setQueue(remainingQueue);
      } else {
        // Time A (perdedor) vai para o final da fila
        const updatedQueue = [...queue, ...teamA];
        // Próximos da fila formam o novo Time A
        const newTeamA = updatedQueue.slice(0, playersPerTeam);
        const remainingQueue = updatedQueue.slice(playersPerTeam);
        setTeamA(newTeamA);
        setQueue(remainingQueue);
      }
      toast.success('Resultado registrado! Times reorganizados.');
    }
    
    setStartTime(null);
    setEndTime(null);
    setIsMatchActive(false);
    setScreen(2);
  };

  const handleEndAll = () => {
    setScreen(1);
    setPlayers([]);
    setTeamA([]);
    setTeamB([]);
    setQueue([]);
    setIsMatchActive(false);
    setStartTime(null);
    setEndTime(null);
    
    // Limpar localStorage
    localStorage.removeItem('pelada_screen');
    localStorage.removeItem('pelada_players');
    localStorage.removeItem('pelada_teamA');
    localStorage.removeItem('pelada_teamB');
    localStorage.removeItem('pelada_queue');
    localStorage.removeItem('pelada_isMatchActive');
    localStorage.removeItem('pelada_startTime');
    localStorage.removeItem('pelada_endTime');
    
    toast.success('Pelada encerrada!');
  };

  const addPlayer = () => {
    if (newPlayer.trim()) {
      setPlayers(prev => [...prev, newPlayer.trim()]);
      setNewPlayer('');
      toast.success(`${newPlayer.trim()} adicionado!`);
    }
  };

  const importPlayers = () => {
    const names = importList.split('\n').filter(n => n.trim());
    if (names.length > 0) {
      setPlayers(prev => [...prev, ...names.map(n => n.trim())]);
      setImportList('');
      toast.success(`${names.length} jogadores importados!`);
    }
  };

  const removeFromList = (index) => {
    setPlayers(prev => prev.filter((_, i) => i !== index));
  };

  const addToQueue = (playerName) => {
    setQueue(prev => [...prev, playerName]);
    toast.success(`${playerName} entrou na fila!`);
  };

  const removeFromQueue = (index) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-indigo-600 text-white py-6 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {screen !== 1 && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => screen === 3 ? setScreen(2) : setScreen(1)}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  ⚽ Pelada Top
                </h1>
                <p className="text-white/80 text-sm">
                  {screen === 1 && 'Organize sua pelada'}
                  {screen === 2 && 'Partida em andamento'}
                  {screen === 3 && 'Resultado da partida'}
                </p>
              </div>
            </div>
            {screen === 2 && (
              <div className="text-right">
                <p className="text-xs text-white/60 uppercase tracking-wide">Jogadores</p>
                <p className="text-xl font-bold">{teamA.length + teamB.length + queue.length}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-24">
        <AnimatePresence mode="wait">
          {/* TELA 1 - CADASTRO */}
          {screen === 1 && (
            <motion.div
              key="cadastro"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Adicionar jogador */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" />
                  Adicionar Jogadores
                </h2>
                
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Nome do jogador..."
                    value={newPlayer}
                    onChange={(e) => setNewPlayer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                    className="flex-1 rounded-xl"
                  />
                  <Button 
                    onClick={addPlayer}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl px-6"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                <div className="relative">
                  <Textarea
                    placeholder="Ou cole uma lista de jogadores (um por linha)..."
                    value={importList}
                    onChange={(e) => setImportList(e.target.value)}
                    className="rounded-xl min-h-[100px]"
                  />
                  {importList && (
                    <Button
                      onClick={importPlayers}
                      size="sm"
                      className="absolute bottom-3 right-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Importar
                    </Button>
                  )}
                </div>
              </div>

              {/* Lista de jogadores */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-500" />
                    Jogadores Cadastrados
                  </h2>
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    {players.length}
                  </span>
                </div>

                {players.length > 0 ? (
                  <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                    {players.map((player, index) => (
                      <motion.div
                        key={`${player}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="basis-1/2 min-w-0 flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium text-slate-700">{player}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromList(index)}
                          className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum jogador cadastrado</p>
                  </div>
                )}
              </div>

              {/* Configurações */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-500" />
                  Configurações
                </h2>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-slate-700">Jogadores por time</Label>
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">
                        {playersPerTeam}
                      </span>
                    </div>
                    <Slider
                      value={[playersPerTeam]}
                      onValueChange={([val]) => setPlayersPerTeam(val)}
                      min={1}
                      max={11}
                      step={1}
                      className="py-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-slate-700">Tempo da partida (min)</Label>
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
                        {matchDuration}
                      </span>
                    </div>
                    <Slider
                      value={[matchDuration]}
                      onValueChange={([val]) => setMatchDuration(val)}
                      min={1}
                      max={30}
                      step={1}
                      className="py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Botão iniciar */}
              <Button
                onClick={distributeInitial}
                disabled={players.length < playersPerTeam * 2}
                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600 rounded-2xl shadow-lg"
              >
                <Shuffle className="w-6 h-6 mr-2" />
                Organizar Pelada
              </Button>

              {players.length < playersPerTeam * 2 && (
                <p className="text-center text-slate-500 text-sm">
                  Adicione pelo menos {playersPerTeam * 2} jogadores para formar 2 times
                </p>
              )}
            </motion.div>
          )}

          {/* TELA 2 - PARTIDA */}
          {screen === 2 && (
            <motion.div
              key="partida"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Times (sempre lado a lado; rolagem horizontal em telas estreitas) */}
              <div className="overflow-x-auto -mx-2 px-2 snap-x snap-mandatory scrollbar-none">
                <div className="grid grid-cols-2 gap-4 min-w-[700px]">
                  <div className="snap-start">
                    <TeamCard
                      title="Time A"
                      players={teamA}
                      variant="teamA"
                      onRemovePlayer={(player, index) => handleRemovePlayer(player, 'teamA', index)}
                      emptyMessage="Time vazio"
                    />
                  </div>
                  <div className="snap-start">
                    <TeamCard
                      title="Time B"
                      players={teamB}
                      variant="teamB"
                      onRemovePlayer={(player, index) => handleRemovePlayer(player, 'teamB', index)}
                      emptyMessage="Time vazio"
                    />
                  </div>
                </div>
              </div>

              {/* Timer */}
              <GameTimer
                duration={matchDuration}
                isActive={isMatchActive}
                startTime={startTime}
                endTime={endTime}
                onStart={handleStartMatch}
                onEnd={handleEndMatch}
              />

              {/* Fila */}
              <QueueSection
                queue={queue}
                playersPerTeam={playersPerTeam}
                onAddPlayer={addToQueue}
                onRemovePlayer={removeFromQueue}
              />
            </motion.div>
          )}

          {/* TELA 3 - RESULTADO */}
          {screen === 3 && (
            <motion.div
              key="resultado"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  Registrar Resultado
                </h2>

                <div className="space-y-6">
                  <div>
                    <Label className="text-slate-700 mb-3 block font-medium">Como terminou a partida?</Label>
                    <RadioGroup value={resultType} onValueChange={setResultType} className="space-y-3">
                      <div
                        onClick={() => setResultType('draw')}
                        className="flex items-center space-x-3 p-4 bg-amber-50 rounded-xl border-2 border-amber-200 cursor-pointer"
                      >
                        <RadioGroupItem value="draw" id="draw" />
                        <Label htmlFor="draw" className="cursor-pointer font-medium">⚖️ Empate</Label>
                      </div>
                      <div
                        onClick={() => setResultType('win')}
                        className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl border-2 border-red-200 cursor-pointer"
                      >
                        <RadioGroupItem value="win" id="win" />
                        <Label htmlFor="win" className="cursor-pointer font-medium">🏆 Houve vencedor</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {resultType === 'draw' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      {queue.length >= playersPerTeam * 2 ? (
                        <>
                          <p className="text-slate-700 mb-1 font-medium">Há dois ou mais times na fila, então:</p>
                          <Label className="text-slate-700 mb-3 block font-medium">Qual time tem preferência na fila?</Label>
                        </>
                      ) : (
                        <Label className="text-slate-700 mb-3 block font-medium">Qual time tem preferência para ficar?</Label>
                      )}
                      <RadioGroup value={preference} onValueChange={setPreference} className="grid grid-cols-2 gap-3">
                        <div
                          onClick={() => setPreference('teamA')}
                          className="flex flex-col justify-center space-y-2 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="teamA" id="prefA" />
                            <Label htmlFor="prefA" className="cursor-pointer font-medium text-emerald-700">Time A</Label>
                          </div>
                          <span className="text-sm text-slate-600">
                            {teamA.length > 0 ? teamA.join(' ') : '—'}
                          </span>
                        </div>
                        <div
                          onClick={() => setPreference('teamB')}
                          className="flex flex-col justify-center space-y-2 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="teamB" id="prefB" />
                            <Label htmlFor="prefB" className="cursor-pointer font-medium text-indigo-700">Time B</Label>
                          </div>
                          <span className="text-sm text-slate-600">
                            {teamB.length > 0 ? teamB.join(' ') : '—'}
                          </span>
                        </div>
                      </RadioGroup>
                    </motion.div>
                  )}

                  {resultType === 'win' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Label className="text-slate-700 mb-3 block font-medium">Qual time Venceu?</Label>
                      <RadioGroup value={winner} onValueChange={setWinner} className="grid grid-cols-2 gap-3">
                        <div
                          onClick={() => setWinner('teamA')}
                          className="flex flex-col justify-center space-y-2 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="teamA" id="winnerA" />
                            <Label htmlFor="winnerA" className="cursor-pointer font-medium text-emerald-700">Time A</Label>
                          </div>
                          <span className="text-sm text-slate-600">
                            {teamA.length > 0 ? teamA.join(' ') : '—'}
                          </span>
                        </div>
                        <div
                          onClick={() => setWinner('teamB')}
                          className="flex flex-col justify-center space-y-2 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200 cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="teamB" id="winnerB" />
                            <Label htmlFor="winnerB" className="cursor-pointer font-medium text-indigo-700">Time B</Label>
                          </div>
                          <span className="text-sm text-slate-600">
                            {teamB.length > 0 ? teamB.join(' ') : '—'}
                          </span>
                        </div>
                      </RadioGroup>
                    </motion.div>
                  )}

                  <Button
                    onClick={handleConfirmResult}
                    className="w-full py-4 text-lg font-bold bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600 rounded-xl"
                  >
                    Confirmar Resultado
                  </Button>
                </div>
              </div>

              {/* Próximos da Fila (resumo) */}
              {queue.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Próximos da Fila</h3>
                  <div className="space-y-3">
                    {Array.from({ length: Math.ceil(queue.length / playersPerTeam) }).map((_, blockIndex) => {
                      const start = blockIndex * playersPerTeam;
                      const block = queue.slice(start, start + playersPerTeam);
                      return (
                        <div key={blockIndex} className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                            {blockIndex + 1}º Próximos a entrar
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {block.map((player, playerIndex) => (
                              <div key={player} className="basis-1/2 min-w-0">
                                <PlayerCard player={player} variant="queue" index={playerIndex} />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <Button
                onClick={handleEndAll}
                variant="outline"
                className="w-full py-4 text-lg font-semibold rounded-xl border-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                Encerrar Pelada
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Dialog de confirmação */}
      <ConfirmDialog
        isOpen={!!confirmRemove}
        title="Remover Jogador"
        message={`Remover ${confirmRemove?.player} da partida? O próximo da fila entrará no lugar.`}
        onConfirm={confirmRemovePlayer}
        onCancel={() => setConfirmRemove(null)}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </div>
  );
}