'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MiniGame, Player, GameResult } from '@/types/game';
import ReactionTimeGame from '@/components/games/ReactionTimeGame';
import FoodMemoryGame from '@/components/games/FoodMemoryGame';
import SpeedTypeGame from '@/components/games/SpeedTypeGame';

interface MiniGameArenaProps {
  game: MiniGame;
  players: Player[];
  currentPlayer: Player;
  onGameComplete: (results: GameResult[]) => void;
}

export default function MiniGameArena({
  game,
  players,
  currentPlayer,
  onGameComplete
}: MiniGameArenaProps) {
  const [timeLeft, setTimeLeft] = useState(game.maxDuration);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [myResult, setMyResult] = useState<any>(null);

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start game after short delay
    const startTimer = setTimeout(() => {
      setGameStarted(true);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(startTimer);
    };
  }, []);

  // Handle game completion
  useEffect(() => {
    if (gameEnded && !myResult) {
      // Generate default result if player didn't complete
      const defaultResult = {
        playerId: currentPlayer.id,
        score: 0,
        time: game.maxDuration,
        accuracy: 0,
        position: players.length
      };
      setMyResult(defaultResult);
    }
  }, [gameEnded, myResult, currentPlayer.id, players.length, game.maxDuration]);

  // Submit results when game ends
  useEffect(() => {
    if (gameEnded && myResult) {
      // Simulate other players' results
      const allResults = players.map((player, index) => {
        if (player.id === currentPlayer.id) {
          return myResult;
        }
        // Generate mock results for other players
        return {
          playerId: player.id,
          score: Math.floor(Math.random() * 100) + 50,
          time: Math.floor(Math.random() * game.maxDuration) + 5,
          accuracy: Math.floor(Math.random() * 40) + 60,
          position: index + 1
        };
      });

      // Sort by score and assign positions
      allResults.sort((a, b) => b.score - a.score);
      allResults.forEach((result, index) => {
        result.position = index + 1;
      });

      setTimeout(() => {
        onGameComplete(allResults);
      }, 2000);
    }
  }, [gameEnded, myResult, players, currentPlayer.id, game.maxDuration, onGameComplete]);

  const handleGameResult = (result: any) => {
    if (!gameEnded) {
      setMyResult(result);
      setGameEnded(true);
    }
  };

  const renderGame = () => {
    if (!gameStarted) return null;

    const commonProps = {
      timeLeft,
      onComplete: handleGameResult,
      isEnded: gameEnded
    };

    switch (game.component) {
      case 'ReactionTime':
        return <ReactionTimeGame {...commonProps} />;
      case 'FoodMemory':
        return <FoodMemoryGame {...commonProps} />;
      case 'SpeedType':
        return <SpeedTypeGame {...commonProps} />;
      default:
        return <div>Jeu non trouvé</div>;
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Game header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="game-card text-center"
      >
        <div className="space-y-3">
          <h2 className="text-3xl font-display font-bold text-white">
            {game.icon} {game.name}
          </h2>
          <p className="text-gray-300">{game.description}</p>
          
          {/* Timer */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <span className={`text-2xl font-display font-bold ${
                timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'
              }`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              <span className="text-lg text-gray-300">{players.length} joueurs</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className={`h-full rounded-full transition-colors ${
                timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 30 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / game.maxDuration) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Game countdown */}
      {!gameStarted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="game-card text-center py-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl font-display font-bold text-white neon-text"
          >
            Get Ready! 🎮
          </motion.div>
          <p className="text-gray-300 mt-4">Le jeu commence dans un instant...</p>
        </motion.div>
      )}

      {/* Game content */}
      {gameStarted && !gameEnded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="game-card"
        >
          {renderGame()}
        </motion.div>
      )}

      {/* Game completed */}
      {gameEnded && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="game-card text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-3xl font-display font-bold text-green-400 mb-4">
              🎉 Terminé!
            </h3>
            
            {myResult && (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">{myResult.score}</p>
                    <p className="text-sm text-gray-400">Points</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{myResult.time}s</p>
                    <p className="text-sm text-gray-400">Temps</p>
                  </div>
                  {myResult.accuracy && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{myResult.accuracy}%</p>
                      <p className="text-sm text-gray-400">Précision</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <motion.div
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-4 text-gray-300"
            >
              Calcul des résultats...
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}