'use client';

import { motion } from 'framer-motion';
import { Player } from '@/types/game';

interface PlayersListProps {
  players: Player[];
  currentPlayerId: string;
}

export default function PlayersList({ players, currentPlayerId }: PlayersListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="game-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-display font-bold text-white">
          👥 Joueurs ({players.length})
        </h3>
      </div>

      <div className="space-y-3">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            variants={itemVariants}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              player.id === currentPlayerId
                ? 'bg-purple-600/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                : 'bg-gray-700/50 border-gray-600'
            }`}
          >
            {/* Player emoji and status */}
            <div className="relative">
              <span className="text-2xl">{player.emoji}</span>
              {player.isHost && (
                <span className="absolute -top-1 -right-1 text-xs">👑</span>
              )}
              {player.isReady && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 -right-1 text-xs bg-green-500 rounded-full w-3 h-3 flex items-center justify-center text-white"
                >
                  ✓
                </motion.span>
              )}
            </div>

            {/* Player info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`font-display font-bold truncate ${
                  player.id === currentPlayerId ? 'text-purple-300' : 'text-white'
                }`}>
                  {player.name}
                  {player.id === currentPlayerId && ' (toi)'}
                </p>
                {player.isHost && (
                  <span className="text-xs bg-yellow-600 text-yellow-100 px-1.5 py-0.5 rounded">
                    HOST
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <span className={`${
                  player.isReady ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {player.isReady ? 'Prêt' : 'En attente'}
                </span>
                {player.score > 0 && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="text-yellow-400">{player.score} pts</span>
                  </>
                )}
              </div>
            </div>

            {/* Connection status */}
            <div className={`w-2 h-2 rounded-full ${
              Date.now() - player.lastSeen < 10000 ? 'bg-green-500' : 'bg-gray-500'
            }`} title={
              Date.now() - player.lastSeen < 10000 ? 'En ligne' : 'Hors ligne'
            } />
          </motion.div>
        ))}
      </div>

      {/* Room info */}
      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="text-xs text-gray-400 space-y-1">
          <p>🎯 Prêts: {players.filter(p => p.isReady).length} / {players.length}</p>
          <p>🏆 Score max: {Math.max(...players.map(p => p.score), 0)}</p>
        </div>
      </div>

      {/* Floating animation for new players */}
      {players.length > 1 && (
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mt-2"
        >
          <span className="text-xs text-gray-500">✨</span>
        </motion.div>
      )}
    </motion.div>
  );
}