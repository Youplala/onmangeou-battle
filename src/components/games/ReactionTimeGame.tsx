'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReactionTimeGameProps {
  timeLeft: number;
  onComplete: (result: { score: number; time: number; accuracy: number }) => void;
  isEnded: boolean;
}

interface GameRound {
  id: number;
  waitTime: number;
  startTime: number;
  reactionTime?: number;
  success?: boolean;
}

export default function ReactionTimeGame({ timeLeft, onComplete, isEnded }: ReactionTimeGameProps) {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'clicked' | 'too-early'>('waiting');
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [score, setScore] = useState(0);
  const roundStartTime = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const colors = [
    'from-red-600 to-red-800',
    'from-green-600 to-green-800',
    'from-blue-600 to-blue-800',
    'from-yellow-600 to-yellow-800',
    'from-purple-600 to-purple-800',
    'from-pink-600 to-pink-800'
  ];

  useEffect(() => {
    if (!isEnded && timeLeft > 0) {
      startNewRound();
    }
  }, []);

  useEffect(() => {
    if (isEnded && !rounds.some(r => r.reactionTime !== undefined)) {
      // Game ended, calculate final score
      const completedRounds = rounds.filter(r => r.reactionTime !== undefined && r.success);
      const totalReactionTime = completedRounds.reduce((sum, r) => sum + (r.reactionTime || 0), 0);
      const averageTime = completedRounds.length > 0 ? totalReactionTime / completedRounds.length : 2000;
      const accuracy = rounds.length > 0 ? (completedRounds.length / rounds.length) * 100 : 0;
      
      // Score based on speed and accuracy (lower time = higher score)
      const speedScore = Math.max(0, 500 - averageTime);
      const accuracyBonus = accuracy * 2;
      const finalScore = Math.round(speedScore + accuracyBonus);

      onComplete({
        score: finalScore,
        time: Math.round(averageTime),
        accuracy: Math.round(accuracy)
      });
    }
  }, [isEnded, rounds, onComplete]);

  const startNewRound = () => {
    if (isEnded) return;

    const waitTime = Math.random() * 3000 + 1000; // 1-4 seconds
    const round: GameRound = {
      id: Date.now(),
      waitTime,
      startTime: Date.now()
    };

    setCurrentRound(round);
    setGameState('waiting');

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout to show "GO" state
    timeoutRef.current = setTimeout(() => {
      if (!isEnded) {
        setGameState('ready');
        roundStartTime.current = Date.now();
        
        // Auto-advance to next round after 3 seconds if no click
        timeoutRef.current = setTimeout(() => {
          if (!isEnded && gameState === 'ready') {
            handleMissed();
          }
        }, 3000);
      }
    }, waitTime);
  };

  const handleClick = () => {
    const now = Date.now();

    if (gameState === 'waiting') {
      // Clicked too early
      setGameState('too-early');
      const failedRound = { ...currentRound!, reactionTime: 0, success: false };
      setRounds(prev => [...prev, failedRound]);
      
      setTimeout(() => {
        if (!isEnded) {
          startNewRound();
        }
      }, 1500);
      return;
    }

    if (gameState === 'ready') {
      // Good click!
      const reactionTime = now - roundStartTime.current;
      setGameState('clicked');
      
      const completedRound = { 
        ...currentRound!, 
        reactionTime, 
        success: true 
      };
      setRounds(prev => [...prev, completedRound]);
      setScore(prev => prev + Math.max(0, 1000 - reactionTime));

      setTimeout(() => {
        if (!isEnded && timeLeft > 2) {
          startNewRound();
        }
      }, 1000);
    }
  };

  const handleMissed = () => {
    const missedRound = { ...currentRound!, reactionTime: 3000, success: false };
    setRounds(prev => [...prev, missedRound]);
    
    if (!isEnded && timeLeft > 2) {
      setTimeout(() => startNewRound(), 500);
    }
  };

  const getBackgroundClass = () => {
    switch (gameState) {
      case 'waiting':
        return 'from-red-600 to-red-800';
      case 'ready':
        return 'from-green-600 to-green-800';
      case 'clicked':
        return 'from-blue-600 to-blue-800';
      case 'too-early':
        return 'from-orange-600 to-orange-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case 'waiting':
        return 'Attends le vert... 🔴';
      case 'ready':
        return 'CLIQUE MAINTENANT! 🟢';
      case 'clicked':
        return `${currentRound?.reactionTime}ms! 🎯`;
      case 'too-early':
        return 'Trop tôt! 🟠';
      default:
        return 'Prêt?';
    }
  };

  if (isEnded) {
    const bestTime = Math.min(...rounds.filter(r => r.success).map(r => r.reactionTime || Infinity));
    const successRate = rounds.length > 0 ? (rounds.filter(r => r.success).length / rounds.length) * 100 : 0;

    return (
      <div className="text-center space-y-6">
        <h3 className="text-2xl font-display font-bold text-white">🎯 Résultats Réflexes</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-2xl font-bold text-green-400">{rounds.filter(r => r.success).length}</p>
            <p className="text-sm text-gray-400">Réussites</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-2xl font-bold text-blue-400">
              {bestTime === Infinity ? '---' : `${bestTime}ms`}
            </p>
            <p className="text-sm text-gray-400">Meilleur temps</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-2xl font-bold text-purple-400">{Math.round(successRate)}%</p>
            <p className="text-sm text-gray-400">Précision</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-lg text-yellow-400 font-bold">Score: {score}</p>
          <p className="text-sm text-gray-400">{rounds.length} essais</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h3 className="text-2xl font-display font-bold text-white">
          ⚡ Test des Réflexes
        </h3>
        <p className="text-gray-300">
          Attends que l'écran devienne vert, puis clique le plus vite possible!
        </p>
      </div>

      {/* Game Area */}
      <motion.div
        className={`relative h-64 rounded-2xl bg-gradient-to-br ${getBackgroundClass()} cursor-pointer overflow-hidden`}
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
        layout
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(255,255,255,0.1)_21%,_rgba(255,255,255,0.1)_25%,_transparent_26%)] bg-[length:40px_40px]" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={gameState}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-4"
            >
              <div className="text-6xl font-display font-bold text-white drop-shadow-lg">
                {getMessage()}
              </div>
              
              {gameState === 'waiting' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-4xl"
                >
                  ⏳
                </motion.div>
              )}

              {gameState === 'ready' && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-4xl"
                >
                  👆
                </motion.div>
              )}

              {gameState === 'clicked' && currentRound?.reactionTime && (
                <div className="space-y-2">
                  <div className="text-2xl text-green-200">
                    {currentRound.reactionTime < 200 ? '🚀 Incroyable!' :
                     currentRound.reactionTime < 300 ? '⚡ Excellent!' :
                     currentRound.reactionTime < 500 ? '👍 Bien!' : '🐌 Peut mieux faire...'}
                  </div>
                </div>
              )}

              {gameState === 'too-early' && (
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl"
                >
                  🚫
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Ripple effect on click */}
        {gameState === 'clicked' && (
          <motion.div
            className="absolute inset-0 border-4 border-white rounded-2xl"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.div>

      {/* Stats */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="text-center">
          <p className="text-white font-bold">{rounds.filter(r => r.success).length}</p>
          <p className="text-gray-400">Réussites</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold">{score}</p>
          <p className="text-gray-400">Points</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold">{rounds.length}</p>
          <p className="text-gray-400">Essais</p>
        </div>
      </div>
    </div>
  );
}