'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getRandomPlayerEmoji } from '@/lib/games';

export default function JoinPage() {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Auto-submit when room code reaches 5 characters
  useEffect(() => {
    if (roomCode.length === 5 && playerName.trim()) {
      handleJoinRoom();
    }
  }, [roomCode, playerName]);

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
    setRoomCode(value);
    setError('');
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setError('Veuillez entrer votre pseudo');
      return;
    }

    if (roomCode.length !== 5) {
      setError('Le code salon doit contenir 5 lettres');
      return;
    }

    setIsJoining(true);
    const playerEmoji = getRandomPlayerEmoji();
    
    // Simulate join delay
    setTimeout(() => {
      router.push(`/room?id=${roomCode}&player=${encodeURIComponent(playerName)}&emoji=${playerEmoji}`);
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <motion.h1 
            className="text-5xl font-display font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent neon-text"
            animate={{ 
              textShadow: [
                '0 0 10px rgba(34, 197, 94, 0.5)',
                '0 0 20px rgba(59, 130, 246, 0.5)',
                '0 0 10px rgba(139, 92, 246, 0.5)'
              ] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Rejoindre
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 font-display"
            variants={itemVariants}
          >
            Entre le code du salon 🎯
          </motion.p>
        </motion.div>

        {/* Back button */}
        <motion.div variants={itemVariants} className="text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Retour à l'accueil
          </button>
        </motion.div>

        {/* Form */}
        <motion.div variants={itemVariants} className="game-card space-y-6">
          {/* Player name */}
          <div className="space-y-2">
            <label className="block text-sm font-display font-bold text-purple-300">
              Ton pseudo
            </label>
            <input
              type="text"
              placeholder="Ton pseudo 🎮"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all font-display"
              maxLength={20}
              autoFocus
            />
          </div>

          {/* Room code */}
          <div className="space-y-2">
            <label className="block text-sm font-display font-bold text-green-300">
              Code du salon (5 lettres)
            </label>
            <motion.input
              type="text"
              placeholder="ABC12"
              value={roomCode}
              onChange={handleRoomCodeChange}
              className="w-full px-4 py-4 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all text-center tracking-[0.3em] text-2xl font-display font-bold uppercase"
              style={{ letterSpacing: '0.3em' }}
              maxLength={5}
              whileFocus={{ scale: 1.02 }}
            />
            
            {/* Character indicators */}
            <div className="flex justify-center gap-2 mt-3">
              {Array.from({ length: 5 }, (_, index) => (
                <motion.div
                  key={index}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    index < roomCode.length
                      ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50'
                      : 'border-gray-600'
                  }`}
                  animate={index < roomCode.length ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-600/20 border border-red-500/50 rounded-lg text-red-300 text-center font-display"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Join button */}
          <motion.button
            onClick={handleJoinRoom}
            disabled={roomCode.length !== 5 || !playerName.trim() || isJoining}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-display font-bold text-xl rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            whileHover={{ scale: (roomCode.length === 5 && playerName.trim()) ? 1.02 : 1 }}
            whileTap={{ scale: (roomCode.length === 5 && playerName.trim()) ? 0.98 : 1 }}
          >
            {isJoining ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Connexion...
              </span>
            ) : (
              `Rejoindre ${roomCode ? roomCode : 'le salon'} 🚀`
            )}
          </motion.button>

          {/* Auto-submit hint */}
          {roomCode.length > 0 && roomCode.length < 5 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-400 text-center"
            >
              💡 La connexion se fera automatiquement dès que tu auras saisi les 5 lettres
            </motion.p>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div variants={itemVariants} className="game-card">
          <h3 className="text-lg font-display font-bold text-green-300 mb-3">
            📋 Comment rejoindre un salon?
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• Demande le <strong>code à 5 lettres</strong> au créateur du salon</p>
            <p>• Saisis ton <strong>pseudo</strong> et le <strong>code</strong></p>
            <p>• Tu seras connecté automatiquement! ✨</p>
          </div>
        </motion.div>

        {/* Fun fact */}
        <motion.div
          variants={itemVariants}
          className="text-center text-gray-400 text-sm"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block text-2xl mb-2"
          >
            🎮
          </motion.div>
          <p>Prêt pour l'aventure culinaire?</p>
        </motion.div>
      </motion.div>
    </div>
  );
}