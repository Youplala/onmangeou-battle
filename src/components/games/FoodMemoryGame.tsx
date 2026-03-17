'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateGamePairs, FOOD_EMOJIS } from '@/lib/games';

interface FoodMemoryGameProps {
  timeLeft: number;
  onComplete: (result: { score: number; time: number; accuracy: number }) => void;
  isEnded: boolean;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function FoodMemoryGame({ timeLeft, onComplete, isEnded }: FoodMemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameStartTime] = useState(Date.now());
  const [isGameComplete, setIsGameComplete] = useState(false);

  const totalPairs = 8; // 16 cards total

  // Initialize game
  useEffect(() => {
    const pairs = generateGamePairs(FOOD_EMOJIS, totalPairs);
    const gameCards: Card[] = pairs.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false
    }));
    setCards(gameCards);
  }, []);

  // Handle game completion
  useEffect(() => {
    if (matches === totalPairs && !isGameComplete) {
      setIsGameComplete(true);
      const gameTime = (Date.now() - gameStartTime) / 1000;
      const accuracy = attempts > 0 ? (matches / attempts) * 100 : 100;
      const speedBonus = Math.max(0, 300 - gameTime) * 10;
      const accuracyBonus = accuracy * 5;
      const score = Math.round(matches * 100 + speedBonus + accuracyBonus);

      onComplete({
        score,
        time: Math.round(gameTime),
        accuracy: Math.round(accuracy)
      });
    }
  }, [matches, totalPairs, isGameComplete, gameStartTime, attempts, onComplete]);

  // Handle time up
  useEffect(() => {
    if (isEnded && !isGameComplete) {
      const gameTime = (Date.now() - gameStartTime) / 1000;
      const accuracy = attempts > 0 ? (matches / attempts) * 100 : 0;
      const score = matches * 100;

      onComplete({
        score,
        time: Math.round(gameTime),
        accuracy: Math.round(accuracy)
      });
    }
  }, [isEnded, isGameComplete, gameStartTime, attempts, matches, onComplete]);

  const handleCardClick = (cardId: number) => {
    if (isEnded || isGameComplete) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlippedCards.length === 2) {
      setAttempts(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true } 
              : c
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
        }, 1500);
      }
    }
  };

  if (isGameComplete) {
    const gameTime = (Date.now() - gameStartTime) / 1000;
    const accuracy = attempts > 0 ? (matches / attempts) * 100 : 100;

    return (
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-3xl font-display font-bold text-green-400 mb-4">
            🎉 Toutes les paires trouvées!
          </h3>
        </motion.div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-2xl font-bold text-green-400">{matches}</p>
            <p className="text-sm text-gray-400">Paires trouvées</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-2xl font-bold text-blue-400">{Math.round(gameTime)}s</p>
            <p className="text-sm text-gray-400">Temps</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-2xl font-bold text-purple-400">{Math.round(accuracy)}%</p>
            <p className="text-sm text-gray-400">Précision</p>
          </div>
        </div>

        {/* Celebration animation */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="text-6xl"
        >
          🏆
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-display font-bold text-white">
          🍕 Memory Food
        </h3>
        <p className="text-gray-300">
          Trouve toutes les paires d'emojis food le plus vite possible!
        </p>
        
        {/* Stats */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-green-400 font-bold text-lg">{matches}/{totalPairs}</p>
            <p className="text-gray-400">Paires</p>
          </div>
          <div className="text-center">
            <p className="text-blue-400 font-bold text-lg">{attempts}</p>
            <p className="text-gray-400">Essais</p>
          </div>
          <div className="text-center">
            <p className="text-purple-400 font-bold text-lg">
              {attempts > 0 ? Math.round((matches / attempts) * 100) : 100}%
            </p>
            <p className="text-gray-400">Précision</p>
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="aspect-square"
          >
            <motion.button
              onClick={() => handleCardClick(card.id)}
              className={`w-full h-full rounded-xl border-2 transition-all duration-300 ${
                card.isMatched
                  ? 'bg-green-600 border-green-400 shadow-lg shadow-green-600/30'
                  : card.isFlipped
                  ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-600/30'
                  : 'bg-gray-700 border-gray-600 hover:border-purple-400 hover:bg-gray-600'
              }`}
              whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
              disabled={card.isMatched || isEnded}
            >
              <AnimatePresence mode="wait">
                {card.isFlipped || card.isMatched ? (
                  <motion.div
                    key="emoji"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl"
                  >
                    {card.emoji}
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl text-gray-400"
                  >
                    🃏
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Hints */}
      {attempts === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-gray-400 text-sm"
        >
          💡 Astuce: Mémorise bien les positions des emojis que tu as vus!
        </motion.div>
      )}

      {/* Encouragement */}
      {attempts > 0 && matches === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-yellow-400 text-sm"
        >
          Continue, tu vas y arriver! 💪
        </motion.div>
      )}

      {matches > 0 && matches < totalPairs && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-green-400 text-sm"
        >
          Super! {matches} paire{matches > 1 ? 's' : ''} trouvée{matches > 1 ? 's' : ''}! 🎉
        </motion.div>
      )}

      {/* Time warning */}
      {timeLeft <= 10 && !isGameComplete && (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-center text-red-400 font-bold"
        >
          ⏰ Plus que {timeLeft} secondes!
        </motion.div>
      )}
    </div>
  );
}