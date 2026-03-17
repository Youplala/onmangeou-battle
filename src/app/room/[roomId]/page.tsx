'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Player, Restaurant, GameRoom, MiniGame, ChatMessage } from '@/types/game';
import { getRandomGame, MINI_GAMES } from '@/lib/games';
import GameLobby from '@/components/GameLobby';
import MiniGameArena from '@/components/MiniGameArena';
import TournamentView from '@/components/TournamentView';
import ChatComponent from '@/components/ChatComponent';
import PlayersList from '@/components/PlayersList';

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params?.roomId as string;
  const playerName = searchParams?.get('player') || '';
  const playerEmoji = searchParams?.get('emoji') || '🎮';
  const isHost = searchParams?.get('host') === 'true';

  const [room, setRoom] = useState<GameRoom | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentGame, setCurrentGame] = useState<MiniGame | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameResults, setGameResults] = useState<any[]>([]);
  const chatRef = useRef<any>(null);

  // Initialize room and player
  useEffect(() => {
    if (!roomId || !playerName) return;

    const player: Player = {
      id: `player-${Date.now()}`,
      name: playerName,
      color: '#8B5CF6',
      emoji: playerEmoji,
      isHost,
      score: 0,
      isReady: false,
      lastSeen: Date.now()
    };

    // Create bot players for demo
    const botPlayers: Player[] = [
      {
        id: 'bot-1',
        name: 'ChefBot',
        color: '#EC4899',
        emoji: '🤖',
        isHost: false,
        score: 0,
        isReady: false,
        lastSeen: Date.now()
      },
      {
        id: 'bot-2',
        name: 'FoodieAI',
        color: '#10B981',
        emoji: '🍕',
        isHost: false,
        score: 0,
        isReady: false,
        lastSeen: Date.now()
      }
    ];

    const initialRoom: GameRoom = {
      id: roomId,
      name: `Salon ${roomId}`,
      players: [player, ...botPlayers],
      restaurants: [],
      gameState: 'lobby',
      createdAt: Date.now(),
      settings: {
        maxPlayers: 8,
        gameTimeLimit: 30,
        minigamesCount: 3
      }
    };

    setCurrentPlayer(player);
    setRoom(initialRoom);

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      playerId: 'system',
      playerName: 'Système',
      message: `Bienvenue ${playerName} ! ${isHost ? 'Tu es l\'host du salon.' : 'Tu as rejoint le salon.'} 🎉`,
      timestamp: Date.now(),
      type: 'system'
    };
    setMessages([welcomeMessage]);

    // Simulate bots joining and submitting restaurants
    setTimeout(() => {
      const botRestaurants = [
        { name: 'Le Petit Bistro', emoji: '🥘', submittedBy: 'bot-1' },
        { name: 'Pizza Palace', emoji: '🍕', submittedBy: 'bot-2' }
      ];

      const restaurantsWithIds = botRestaurants.map((rest, index) => ({
        ...rest,
        id: `restaurant-bot-${index + 1}`
      }));

      setRoom(prev => prev ? {
        ...prev,
        restaurants: [...prev.restaurants, ...restaurantsWithIds]
      } : null);

      // Add bot messages
      const botMessages: ChatMessage[] = [
        {
          id: 'bot-msg-1',
          playerId: 'bot-1',
          playerName: 'ChefBot',
          message: 'propose Le Petit Bistro 🥘',
          timestamp: Date.now() + 1000,
          type: 'system'
        },
        {
          id: 'bot-msg-2',
          playerId: 'bot-2',
          playerName: 'FoodieAI',
          message: 'propose Pizza Palace 🍕',
          timestamp: Date.now() + 2000,
          type: 'system'
        }
      ];
      setMessages(prev => [...prev, ...botMessages]);
    }, 2000);

    // Simulate bots getting ready after user submits restaurant
    setTimeout(() => {
      setRoom(prev => prev ? {
        ...prev,
        players: prev.players.map(p => 
          p.id.startsWith('bot-') ? { ...p, isReady: true } : p
        )
      } : null);

      const readyMessages: ChatMessage[] = [
        {
          id: 'bot-ready-1',
          playerId: 'bot-1',
          playerName: 'ChefBot',
          message: 'est prêt! ✅',
          timestamp: Date.now() + 3000,
          type: 'system'
        },
        {
          id: 'bot-ready-2',
          playerId: 'bot-2',
          playerName: 'FoodieAI',
          message: 'est prêt! ✅',
          timestamp: Date.now() + 4000,
          type: 'system'
        }
      ];
      setMessages(prev => [...prev, ...readyMessages]);
    }, 8000);
  }, [roomId, playerName, playerEmoji, isHost]);

  const handleSubmitRestaurant = (restaurant: Omit<Restaurant, 'id'>) => {
    if (!room || !currentPlayer) return;

    const newRestaurant: Restaurant = {
      id: `restaurant-${Date.now()}`,
      ...restaurant,
      submittedBy: currentPlayer.id
    };

    const updatedRoom = {
      ...room,
      restaurants: [...room.restaurants, newRestaurant]
    };

    setRoom(updatedRoom);

    // Add chat message
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      message: `propose ${restaurant.name} ${restaurant.emoji}`,
      timestamp: Date.now(),
      type: 'system'
    };
    setMessages(prev => [...prev, message]);
  };

  const handlePlayerReady = () => {
    if (!room || !currentPlayer) return;

    const updatedPlayer = { ...currentPlayer, isReady: !currentPlayer.isReady };
    const updatedPlayers = room.players.map(p => 
      p.id === currentPlayer.id ? updatedPlayer : p
    );

    setCurrentPlayer(updatedPlayer);
    setRoom({ ...room, players: updatedPlayers });

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      message: updatedPlayer.isReady ? 'est prêt! ✅' : 'n\'est plus prêt ❌',
      timestamp: Date.now(),
      type: 'system'
    };
    setMessages(prev => [...prev, message]);
  };

  const handleStartGames = () => {
    if (!room || !currentPlayer?.isHost) return;

    // Check if all players are ready and have submitted restaurants
    const allReady = room.players.every(p => p.isReady);
    const allHaveRestaurants = room.players.length === room.restaurants.length;

    if (!allReady || !allHaveRestaurants) {
      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        playerId: 'system',
        playerName: 'Système',
        message: 'Tous les joueurs doivent être prêts et avoir proposé un restaurant! ⚠️',
        timestamp: Date.now(),
        type: 'system'
      };
      setMessages(prev => [...prev, message]);
      return;
    }

    // Start countdown
    let count = 3;
    setCountdown(count);

    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        setCountdown(null);
        clearInterval(countdownInterval);
        
        // Start first game
        const firstGame = getRandomGame();
        setCurrentGame(firstGame);
        setRoom({ ...room, gameState: 'playing' });

        const message: ChatMessage = {
          id: `msg-${Date.now()}`,
          playerId: 'system',
          playerName: 'Système',
          message: `🎮 C'est parti pour ${firstGame.name}!`,
          timestamp: Date.now(),
          type: 'game'
        };
        setMessages(prev => [...prev, message]);
      }
    }, 1000);
  };

  const handleGameComplete = (results: any[]) => {
    setGameResults(results);
    setCurrentGame(null);
    
    if (!room) return;

    // Update player scores
    const updatedPlayers = room.players.map(player => {
      const result = results.find(r => r.playerId === player.id);
      return result ? { ...player, score: player.score + result.score } : player;
    });

    setRoom({ ...room, players: updatedPlayers, gameState: 'results' });

    // Show results for a few seconds, then continue
    setTimeout(() => {
      setRoom(prev => prev ? { ...prev, gameState: 'tournament' } : null);
    }, 3000);
  };

  const handleSendMessage = (message: string) => {
    if (!currentPlayer) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      message,
      timestamp: Date.now(),
      type: 'chat'
    };

    setMessages(prev => [...prev, newMessage]);
  };

  if (!room || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Chargement du salon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                Salon <span className="text-purple-400">{roomId}</span>
              </h1>
              <p className="text-gray-400">
                {room.players.length} joueur{room.players.length > 1 ? 's' : ''} • {room.restaurants.length} resto{room.restaurants.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Tu es</p>
              <p className="text-white font-display font-bold">
                {currentPlayer.emoji} {currentPlayer.name}
                {currentPlayer.isHost && ' 👑'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            {/* Countdown overlay */}
            <AnimatePresence>
              {countdown && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-9xl font-display font-bold text-white neon-text"
                  >
                    {countdown}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Game content based on state */}
            {room.gameState === 'lobby' && (
              <GameLobby
                room={room}
                currentPlayer={currentPlayer}
                onSubmitRestaurant={handleSubmitRestaurant}
                onPlayerReady={handlePlayerReady}
                onStartGames={handleStartGames}
              />
            )}

            {room.gameState === 'playing' && currentGame && (
              <MiniGameArena
                game={currentGame}
                players={room.players}
                currentPlayer={currentPlayer}
                onGameComplete={handleGameComplete}
              />
            )}

            {(room.gameState === 'results' || room.gameState === 'tournament') && (
              <TournamentView
                room={room}
                gameResults={gameResults}
                onNextGame={() => {
                  // Start next game or finish tournament
                  const nextGame = getRandomGame();
                  setCurrentGame(nextGame);
                  setRoom({ ...room, gameState: 'playing' });
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PlayersList players={room.players} currentPlayerId={currentPlayer.id} />
            <ChatComponent
              ref={chatRef}
              messages={messages}
              currentPlayer={currentPlayer}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}