'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRoom, GameResult, Restaurant } from '@/types/game';

interface TournamentViewProps {
  room: GameRoom;
  gameResults: GameResult[];
  onNextGame?: () => void;
}

export default function TournamentView({ room, gameResults, onNextGame }: TournamentViewProps) {
  const [showingResults, setShowingResults] = useState(true);
  const [tournamentWinner, setTournamentWinner] = useState<Restaurant | null>(null);

  // Show results first, then tournament
  useEffect(() => {
    if (room.gameState === 'results') {
      const timer = setTimeout(() => {
        setShowingResults(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [room.gameState]);

  // Simulate tournament completion
  useEffect(() => {
    if (!showingResults && !tournamentWinner && room.restaurants.length > 0) {
      // Simple tournament simulation - highest scoring player's restaurant wins
      const sortedResults = [...gameResults].sort((a, b) => b.score - a.score);
      if (sortedResults.length > 0) {
        const winningPlayerId = sortedResults[0].playerId;
        const winningRestaurant = room.restaurants.find(r => r.submittedBy === winningPlayerId);
        
        setTimeout(() => {
          setTournamentWinner(winningRestaurant || room.restaurants[0]);
        }, 2000);
      }
    }
  }, [showingResults, tournamentWinner, room.restaurants, gameResults]);

  const getSortedResults = () => {
    return [...gameResults].sort((a, b) => b.score - a.score);
  };

  const getPlayerName = (playerId: string) => {
    const player = room.players.find(p => p.id === playerId);
    return player ? `${player.emoji} ${player.name}` : 'Joueur inconnu';
  };

  const getPlayerRestaurant = (playerId: string) => {
    return room.restaurants.find(r => r.submittedBy === playerId);
  };

  const createConfetti = () => {
    return Array.from({ length: 20 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-3 h-3 rounded-full"
        style={{
          background: ['#8B5CF6', '#EC4899', '#F97316', '#22C55E', '#3B82F6'][i % 5],
          left: `${Math.random() * 100}%`,
          top: `-10px`
        }}
        animate={{
          y: ['0vh', '110vh'],
          x: [0, Math.sin(i) * 100],
          rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)]
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          delay: i * 0.1,
          ease: 'easeOut'
        }}
      />
    ));
  };

  if (showingResults && gameResults.length > 0) {
    const sortedResults = getSortedResults();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Results Header */}
        <div className="game-card text-center">
          <motion.h2
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-display font-bold text-white mb-4"
          >
            🏆 Résultats du Mini-Jeu
          </motion.h2>
        </div>

        {/* Podium */}
        <div className="game-card">
          <div className="flex justify-center items-end gap-4 mb-6">
            {sortedResults.slice(0, 3).map((result, index) => (
              <motion.div
                key={result.playerId}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className={`text-center ${
                  index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'
                }`}
              >
                {/* Podium step */}
                <div className={`
                  w-20 rounded-t-lg mb-4 flex items-center justify-center text-4xl
                  ${index === 0 ? 'h-24 bg-gradient-to-t from-yellow-600 to-yellow-400' :
                    index === 1 ? 'h-20 bg-gradient-to-t from-gray-600 to-gray-400' :
                    'h-16 bg-gradient-to-t from-orange-600 to-orange-400'}
                `}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
                
                {/* Player info */}
                <div className="space-y-2">
                  <p className="font-display font-bold text-white text-sm">
                    {getPlayerName(result.playerId)}
                  </p>
                  <p className={`font-bold text-lg ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-300' :
                    'text-orange-400'
                  }`}>
                    {result.score}
                  </p>
                  <p className="text-xs text-gray-400">
                    {result.time}s • {result.accuracy}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Full results */}
          {sortedResults.length > 3 && (
            <div className="space-y-2">
              <h4 className="font-display font-bold text-purple-300 text-center mb-3">
                Classement complet
              </h4>
              {sortedResults.slice(3).map((result, index) => (
                <motion.div
                  key={result.playerId}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">
                      #{index + 4}
                    </span>
                    <span className="text-white">
                      {getPlayerName(result.playerId)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{result.score}</p>
                    <p className="text-xs text-gray-400">
                      {result.time}s • {result.accuracy}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Next phase indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-gray-300"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block text-2xl mb-2"
          >
            ⚡
          </motion.div>
          <p>Préparation du tournoi final...</p>
        </motion.div>
      </motion.div>
    );
  }

  if (tournamentWinner) {
    const winnerPlayer = room.players.find(p => p.id === tournamentWinner.submittedBy);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative space-y-6"
      >
        {/* Confetti */}
        <div className="fixed inset-0 pointer-events-none z-50">
          {createConfetti()}
        </div>

        {/* Winner announcement */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="game-card text-center py-12"
        >
          <motion.h1
            className="text-5xl font-display font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent neon-text mb-6"
            animate={{
              textShadow: [
                '0 0 20px rgba(255, 215, 0, 0.5)',
                '0 0 40px rgba(255, 165, 0, 0.8)',
                '0 0 20px rgba(255, 215, 0, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉 VICTOIRE! 🎉
          </motion.h1>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-6"
          >
            {/* Winner restaurant */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-2xl p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="text-6xl">{tournamentWinner.emoji}</div>
                <h2 className="text-3xl font-display font-bold text-white">
                  {tournamentWinner.name}
                </h2>
                <p className="text-yellow-300 text-lg">
                  Proposé par {winnerPlayer?.emoji} {winnerPlayer?.name}
                </p>
                
                {tournamentWinner.url && (
                  <motion.a
                    href={tournamentWinner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-display font-bold text-lg rounded-xl shadow-lg hover:scale-105 transition-transform"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🍽️ Voir le restaurant
                  </motion.a>
                )}
              </div>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-2xl text-gray-300"
            >
              C'est décidé, vous allez manger ici! 🎯
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Tournament bracket (simplified) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="game-card"
        >
          <h3 className="text-2xl font-display font-bold text-purple-300 text-center mb-6">
            🏆 Parcours du tournoi
          </h3>
          
          <div className="space-y-4">
            {room.restaurants.map((restaurant, index) => {
              const player = room.players.find(p => p.id === restaurant.submittedBy);
              const isWinner = restaurant.id === tournamentWinner.id;
              
              return (
                <motion.div
                  key={restaurant.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 2.2 + index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isWinner
                      ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500 shadow-lg'
                      : 'bg-gray-700/50 border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{restaurant.emoji}</span>
                    <div>
                      <p className={`font-display font-bold ${
                        isWinner ? 'text-yellow-300' : 'text-white'
                      }`}>
                        {restaurant.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        par {player?.emoji} {player?.name}
                      </p>
                    </div>
                  </div>
                  
                  {isWinner && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-3xl"
                    >
                      👑
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Play again button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="text-center"
        >
          <button
            onClick={() => window.location.href = '/'}
            className="game-button px-8 py-4 text-xl"
          >
            🎮 Rejouer une partie
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // Tournament in progress
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="game-card text-center py-12"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl mb-6"
      >
        🏆
      </motion.div>
      
      <h2 className="text-3xl font-display font-bold text-white mb-4">
        Tournoi en cours...
      </h2>
      
      <p className="text-gray-300 mb-6">
        Les restaurants s'affrontent pour la victoire finale!
      </p>
      
      <motion.div
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-gray-400"
      >
        Préparation du résultat final...
      </motion.div>
    </motion.div>
  );
}