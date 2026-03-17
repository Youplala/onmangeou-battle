'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { generateRoomCode, getRandomPlayerEmoji } from '@/lib/games';

export default function HomePage() {
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const router = useRouter();

  const handleCreateRoom = async () => {
    if (!playerName.trim()) return;
    
    setIsCreating(true);
    const roomCode = generateRoomCode();
    const playerEmoji = getRandomPlayerEmoji();
    
    // Simulate room creation
    setTimeout(() => {
      router.push(`/room/${roomCode}?player=${encodeURIComponent(playerName)}&emoji=${playerEmoji}&host=true`);
    }, 1000);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || joinCode.trim().length !== 5) return;
    
    setIsJoining(true);
    const playerEmoji = getRandomPlayerEmoji();
    
    setTimeout(() => {
      router.push(`/room/${joinCode.toUpperCase()}?player=${encodeURIComponent(playerName)}&emoji=${playerEmoji}`);
    }, 500);
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
        className="max-w-md w-full space-y-8 text-center"
      >
        {/* Title */}
        <motion.div variants={itemVariants} className="space-y-4">
          <motion.h1 
            className="text-6xl font-display font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent neon-text"
            animate={{ 
              textShadow: [
                '0 0 10px rgba(139, 92, 246, 0.5)',
                '0 0 20px rgba(236, 72, 153, 0.5)',
                '0 0 10px rgba(139, 92, 246, 0.5)'
              ] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            On Mange Où?!
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 font-display"
            variants={itemVariants}
          >
            Battle Edition 🍕⚔️🍔
          </motion.p>
        </motion.div>

        {/* Floating emojis */}
        <motion.div className="relative h-20">
          {['🍕', '🍔', '🍣', '🌮', '🍜', '🥗'].map((emoji, index) => (
            <motion.div
              key={emoji}
              className="absolute text-4xl"
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(Date.now() / 1000 + index) * 10, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 3 + index * 0.5,
                repeat: Infinity,
                delay: index * 0.5
              }}
              style={{
                left: `${15 + index * 12}%`,
                top: `${Math.sin(index) * 20 + 50}%`
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants} className="space-y-3">
          <p className="text-lg text-gray-300">
            Créée un salon, invitez vos amis, proposez vos restos préférés
          </p>
          <p className="text-lg font-bold text-yellow-400">
            🎮 Affrontez-vous dans des mini-jeux délirants!
          </p>
          <p className="text-base text-gray-400">
            Le gagnant choisit où vous allez manger 🏆
          </p>
        </motion.div>

        {/* Player name input */}
        <motion.div variants={itemVariants}>
          <input
            type="text"
            placeholder="Ton pseudo 🎮"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all font-display"
            maxLength={20}
          />
        </motion.div>

        {/* Action buttons */}
        <motion.div variants={itemVariants} className="space-y-4">
          <motion.button
            onClick={handleCreateRoom}
            disabled={!playerName.trim() || isCreating}
            className="game-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: playerName.trim() ? 1.02 : 1 }}
            whileTap={{ scale: playerName.trim() ? 0.98 : 1 }}
          >
            {isCreating ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Création en cours...
              </span>
            ) : (
              'Créer un salon 🚀'
            )}
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-900 text-gray-400 font-display">ou</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Code du salon (ex: PARTY)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all font-display text-center tracking-widest"
              maxLength={5}
            />
            <motion.button
              onClick={handleJoinRoom}
              disabled={!playerName.trim() || joinCode.trim().length !== 5 || isJoining}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-display font-bold text-lg rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              whileHover={{ scale: (playerName.trim() && joinCode.trim().length === 5) ? 1.02 : 1 }}
              whileTap={{ scale: (playerName.trim() && joinCode.trim().length === 5) ? 0.98 : 1 }}
            >
              {isJoining ? 'Connexion...' : 'Rejoindre 🎯'}
            </motion.button>
            
            <div className="text-center">
              <button
                onClick={() => router.push('/join')}
                className="text-green-400 hover:text-green-300 transition-colors font-display text-sm underline"
              >
                🔤 Ou utilise le clavier interactif
              </button>
            </div>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div variants={itemVariants} className="pt-8">
          <motion.div 
            className="game-card space-y-3"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-display font-bold text-purple-300">Comment ça marche?</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>🎮 <strong>1.</strong> Chaque joueur propose un restaurant</p>
              <p>⚡ <strong>2.</strong> Affrontement dans des mini-jeux rapides</p>
              <p>🏆 <strong>3.</strong> Tournoi éliminatoire entre restos</p>
              <p>🍽️ <strong>4.</strong> Le resto gagnant = votre destination!</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}