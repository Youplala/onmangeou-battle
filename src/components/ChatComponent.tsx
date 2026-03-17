'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, Player } from '@/types/game';

interface ChatComponentProps {
  messages: ChatMessage[];
  currentPlayer: Player;
  onSendMessage: (message: string) => void;
}

export interface ChatComponentRef {
  scrollToBottom: () => void;
}

const ChatComponent = forwardRef<ChatComponentRef, ChatComponentProps>(({
  messages,
  currentPlayer,
  onSendMessage
}, ref) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    onSendMessage(inputMessage.trim());
    setInputMessage('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStyle = (message: ChatMessage) => {
    switch (message.type) {
      case 'system':
        return 'bg-blue-600/20 border-blue-500/30 text-blue-200';
      case 'game':
        return 'bg-orange-600/20 border-orange-500/30 text-orange-200';
      default:
        return message.playerId === currentPlayer.id
          ? 'bg-purple-600/20 border-purple-500/30 text-purple-100 ml-4'
          : 'bg-gray-700/50 border-gray-600/50 text-gray-200 mr-4';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="game-card h-96 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-600">
        <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
          💬 Chat
          {messages.filter(m => m.type === 'chat').length > 0 && (
            <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
              {messages.filter(m => m.type === 'chat').length}
            </span>
          )}
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isOpen ? '🔽' : '🔼'}
        </button>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto space-y-2 mb-3 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            >
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-2 rounded-lg border text-sm transition-all hover:shadow-lg ${getMessageStyle(message)}`}
                  >
                    {message.type === 'chat' && message.playerId !== 'system' && (
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold opacity-70">
                          {message.playerId === currentPlayer.id ? 'Toi' : message.playerName}:
                        </span>
                        <div className="flex-1">
                          <p>{message.message}</p>
                          <p className="text-xs opacity-50 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {(message.type === 'system' || message.type === 'game') && (
                      <div className="text-center">
                        <p>
                          {message.type === 'system' && '🤖 '}
                          {message.type === 'game' && '🎮 '}
                          <span className="font-display">
                            {message.playerName !== 'Système' && message.playerName + ' '}
                            {message.message}
                          </span>
                        </p>
                        <p className="text-xs opacity-50 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tape ton message..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all text-sm"
                maxLength={200}
              />
              <motion.button
                type="submit"
                disabled={!inputMessage.trim()}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-display font-bold"
              >
                💬
              </motion.button>
            </form>

            {/* Quick reactions */}
            <div className="flex gap-1 mt-2">
              {['🎉', '😂', '🔥', '👍', '💪', '🤔'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => onSendMessage(emoji)}
                  className="p-1 text-lg hover:scale-110 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

ChatComponent.displayName = 'ChatComponent';

export default ChatComponent;