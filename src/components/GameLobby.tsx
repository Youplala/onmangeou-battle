'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Player, Restaurant, GameRoom } from '@/types/game';
import { FOOD_EMOJIS } from '@/lib/games';
import CopyButton from '@/components/ui/CopyButton';

interface GameLobbyProps {
  room: GameRoom;
  currentPlayer: Player;
  onSubmitRestaurant: (restaurant: Omit<Restaurant, 'id'>) => void;
  onPlayerReady: () => void;
  onStartGames: () => void;
}

export default function GameLobby({ 
  room, 
  currentPlayer, 
  onSubmitRestaurant, 
  onPlayerReady, 
  onStartGames 
}: GameLobbyProps) {
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantUrl, setRestaurantUrl] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🍕');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const hasSubmittedRestaurant = room.restaurants.some(r => r.submittedBy === currentPlayer.id);
  const allPlayersReady = room.players.every(p => p.isReady);
  const allHaveRestaurants = room.players.length === room.restaurants.length;
  const canStart = currentPlayer.isHost && allPlayersReady && allHaveRestaurants && room.players.length >= 1;
  
  // Generate room URL for sharing
  const roomUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/onmangeou-battle/room?id=${room.id}` 
    : '';

  const handleSubmit = () => {
    if (!restaurantName.trim() || hasSubmittedRestaurant) return;

    onSubmitRestaurant({
      name: restaurantName.trim(),
      url: restaurantUrl.trim() || undefined,
      submittedBy: currentPlayer.id,
      emoji: selectedEmoji
    });

    setRestaurantName('');
    setRestaurantUrl('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome message */}
      <motion.div variants={itemVariants} className="game-card">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-display font-bold text-purple-300">
            🎪 Bienvenue dans le lobby!
          </h2>
          <p className="text-gray-300">
            Chaque joueur doit proposer un restaurant, puis on lance les mini-jeux! 🎮
          </p>
        </div>
      </motion.div>

      {/* Room sharing */}
      <motion.div variants={itemVariants} className="game-card">
        <h3 className="text-xl font-display font-bold text-white mb-4 text-center">
          📱 Inviter des amis
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* QR Code */}
          <div className="text-center space-y-3">
            <div className="bg-white p-4 rounded-xl inline-block">
              <QRCodeSVG 
                value={roomUrl}
                size={120}
                bgColor="white"
                fgColor="#1F2937"
                level="M"
                includeMargin={false}
              />
            </div>
            <p className="text-sm text-gray-400">
              📱 Scanner pour rejoindre
            </p>
          </div>
          
          {/* Room code and sharing */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Code du salon</p>
              <div className="flex justify-center gap-1 mb-4">
                {room.id.split('').map((char, i) => (
                  <span
                    key={i}
                    className="w-8 h-10 bg-purple-600/20 border border-purple-500 rounded-lg flex items-center justify-center text-lg font-bold text-purple-300"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <CopyButton 
                text={roomUrl}
                label="Copier le lien"
                className="w-full"
              />
              
              <CopyButton 
                text={room.id}
                label="Copier le code"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              />
            </div>
            
            <p className="text-xs text-gray-400 text-center">
              Partage le lien ou dis le code à tes amis!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Restaurant submission */}
      {!hasSubmittedRestaurant && (
        <motion.div variants={itemVariants} className="game-card">
          <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
            🍽️ Propose ton restaurant préféré
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-2xl hover:bg-gray-600 transition-colors"
              >
                {selectedEmoji}
              </button>
              <input
                type="text"
                placeholder="Nom du restaurant"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                maxLength={50}
              />
            </div>

            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-8 gap-2 p-4 bg-gray-700 rounded-xl border border-gray-600"
              >
                {FOOD_EMOJIS.slice(0, 24).map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setSelectedEmoji(emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="p-2 text-xl hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}

            <input
              type="url"
              placeholder="Lien (optionnel)"
              value={restaurantUrl}
              onChange={(e) => setRestaurantUrl(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
            />

            <button
              onClick={handleSubmit}
              disabled={!restaurantName.trim()}
              className="game-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ajouter mon restaurant {selectedEmoji}
            </button>
          </div>
        </motion.div>
      )}

      {/* Submitted restaurants */}
      {room.restaurants.length > 0 && (
        <motion.div variants={itemVariants} className="game-card">
          <h3 className="text-xl font-display font-bold text-white mb-4">
            🏆 Restaurants en compétition
          </h3>
          <div className="grid gap-3">
            {room.restaurants.map((restaurant, index) => {
              const player = room.players.find(p => p.id === restaurant.submittedBy);
              return (
                <motion.div
                  key={restaurant.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{restaurant.emoji}</span>
                    <div>
                      <p className="font-display font-bold text-white">{restaurant.name}</p>
                      <p className="text-sm text-gray-400">
                        par {player?.emoji} {player?.name}
                      </p>
                    </div>
                  </div>
                  {restaurant.url && (
                    <a
                      href={restaurant.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Voir
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Ready status */}
      {hasSubmittedRestaurant && (
        <motion.div variants={itemVariants} className="game-card text-center">
          <button
            onClick={onPlayerReady}
            className={`px-8 py-4 rounded-xl font-display font-bold text-lg transition-all transform hover:scale-105 ${
              currentPlayer.isReady
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                : 'bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {currentPlayer.isReady ? '✅ Prêt!' : '⏳ Je suis prêt'}
          </button>
          
          <div className="mt-4 space-y-2">
            <p className="text-gray-400">
              {room.players.filter(p => p.isReady).length} / {room.players.length} joueurs prêts
            </p>
            {!allHaveRestaurants && (
              <p className="text-yellow-400 text-sm">
                ⚠️ Tous les joueurs doivent proposer un restaurant
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Start button (host only) */}
      {currentPlayer.isHost && (
        <motion.div variants={itemVariants} className="text-center">
          <button
            onClick={onStartGames}
            disabled={!canStart}
            className={`px-8 py-4 rounded-xl font-display font-bold text-xl transition-all transform hover:scale-105 ${
              canStart
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg animate-pulse-fast'
                : 'bg-gray-700 border border-gray-600 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canStart ? '🚀 LANCER LES JEUX!' : '⏳ En attente...'}
          </button>
          
          {!canStart && (
            <p className="mt-2 text-sm text-gray-400">
              {!allPlayersReady && 'Tous les joueurs doivent être prêts'}
              {!allHaveRestaurants && !allPlayersReady && ' et '}
              {!allHaveRestaurants && 'avoir proposé un restaurant'}
            </p>
          )}
        </motion.div>
      )}

      {/* Game info */}
      <motion.div variants={itemVariants} className="game-card">
        <h4 className="font-display font-bold text-purple-300 mb-3">🎯 Les règles du jeu</h4>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• Chaque joueur propose un restaurant</p>
          <p>• Affrontement dans {room.settings.minigamesCount} mini-jeux rapides</p>
          <p>• Tournoi éliminatoire entre les restaurants</p>
          <p>• Le restaurant gagnant = votre destination lunch! 🍽️</p>
        </div>
      </motion.div>
    </motion.div>
  );
}