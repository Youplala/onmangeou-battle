'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SPEED_TYPE_SENTENCES } from '@/lib/games';

interface SpeedTypeGameProps {
  timeLeft: number;
  onComplete: (result: { score: number; time: number; accuracy: number }) => void;
  isEnded: boolean;
}

export default function SpeedTypeGame({ timeLeft, onComplete, isEnded }: SpeedTypeGameProps) {
  const [sentence, setSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [gameStartTime] = useState(Date.now());
  const [isTypingStarted, setIsTypingStarted] = useState(false);
  const [typingStartTime, setTypingStartTime] = useState(0);
  const [errors, setErrors] = useState<number[]>([]);
  const [completedSentences, setCompletedSentences] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize game
  useEffect(() => {
    const randomSentence = SPEED_TYPE_SENTENCES[Math.floor(Math.random() * SPEED_TYPE_SENTENCES.length)];
    setSentence(randomSentence);
    
    // Focus input after short delay
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  // Handle input changes
  useEffect(() => {
    if (!isTypingStarted && userInput.length > 0) {
      setIsTypingStarted(true);
      setTypingStartTime(Date.now());
    }

    // Check for errors
    const newErrors: number[] = [];
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] !== sentence[i]) {
        newErrors.push(i);
      }
    }
    setErrors(newErrors);

    // Check if sentence is completed
    if (userInput === sentence && !isGameComplete) {
      const typingTime = (Date.now() - typingStartTime) / 1000;
      const wordsTyped = sentence.split(' ').length;
      const wpm = Math.round((wordsTyped / typingTime) * 60);
      const accuracy = ((sentence.length - newErrors.length) / sentence.length) * 100;
      
      setCompletedSentences(prev => prev + 1);
      
      if (timeLeft > 5) {
        // Start new sentence
        setTimeout(() => {
          const nextSentence = SPEED_TYPE_SENTENCES[Math.floor(Math.random() * SPEED_TYPE_SENTENCES.length)];
          setSentence(nextSentence);
          setUserInput('');
          setErrors([]);
          setIsTypingStarted(false);
          inputRef.current?.focus();
        }, 1500);
      } else {
        // Game complete
        setIsGameComplete(true);
        const totalTime = (Date.now() - gameStartTime) / 1000;
        const finalScore = Math.round(wpm * 10 + accuracy * 5);
        
        onComplete({
          score: finalScore,
          time: Math.round(totalTime),
          accuracy: Math.round(accuracy)
        });
      }
    }
  }, [userInput, sentence, isTypingStarted, typingStartTime, isGameComplete, timeLeft, gameStartTime, onComplete]);

  // Handle time up
  useEffect(() => {
    if (isEnded && !isGameComplete) {
      const totalTime = (Date.now() - gameStartTime) / 1000;
      const accuracy = userInput.length > 0 ? ((userInput.length - errors.length) / userInput.length) * 100 : 0;
      const completionRate = (userInput.length / sentence.length) * 100;
      const score = Math.round(completedSentences * 500 + completionRate * 2 + accuracy);

      onComplete({
        score,
        time: Math.round(totalTime),
        accuracy: Math.round(accuracy)
      });
    }
  }, [isEnded, isGameComplete, gameStartTime, userInput, errors.length, sentence.length, completedSentences, onComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEnded || isGameComplete) return;
    setUserInput(e.target.value);
  };

  const getCharacterStyle = (index: number) => {
    if (index < userInput.length) {
      return errors.includes(index) ? 'text-red-400 bg-red-400/20' : 'text-green-400 bg-green-400/20';
    }
    return 'text-gray-400';
  };

  const getCurrentStats = () => {
    if (!isTypingStarted || typingStartTime === 0) return { wpm: 0, accuracy: 100 };
    
    const timeElapsed = (Date.now() - typingStartTime) / 1000;
    const wordsTyped = userInput.split(' ').length;
    const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
    const accuracy = userInput.length > 0 ? ((userInput.length - errors.length) / userInput.length) * 100 : 100;
    
    return { wpm, accuracy };
  };

  const { wpm, accuracy } = getCurrentStats();
  const progress = (userInput.length / sentence.length) * 100;

  if (isGameComplete || (isEnded && userInput === sentence)) {
    return (
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-3xl font-display font-bold text-green-400 mb-4">
            🎯 Phrase complétée!
          </h3>
          <div className="text-xl text-yellow-400 mb-4">
            "{sentence}"
          </div>
        </motion.div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-2xl font-bold text-blue-400">{wpm}</p>
            <p className="text-sm text-gray-400">Mots/min</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-2xl font-bold text-green-400">{Math.round(accuracy)}%</p>
            <p className="text-sm text-gray-400">Précision</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-2xl font-bold text-purple-400">{completedSentences}</p>
            <p className="text-sm text-gray-400">Phrases</p>
          </div>
        </div>

        {/* Performance feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg"
        >
          {wpm >= 60 ? '🚀 Vitesse incroyable!' :
           wpm >= 40 ? '⚡ Très rapide!' :
           wpm >= 25 ? '👍 Bien joué!' :
           '💪 Continue de t\'entraîner!'}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-display font-bold text-white">
          📝 Speed Food
        </h3>
        <p className="text-gray-300">
          Tape la phrase le plus vite possible sans faire d'erreur!
        </p>
      </div>

      {/* Live Stats */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="text-center">
          <p className="text-blue-400 font-bold text-lg">{wpm}</p>
          <p className="text-gray-400">Mots/min</p>
        </div>
        <div className="text-center">
          <p className="text-green-400 font-bold text-lg">{Math.round(accuracy)}%</p>
          <p className="text-gray-400">Précision</p>
        </div>
        <div className="text-center">
          <p className="text-purple-400 font-bold text-lg">{completedSentences}</p>
          <p className="text-gray-400">Phrases</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-3">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Sentence Display */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-600">
        <div className="text-xl leading-relaxed font-mono">
          {sentence.split('').map((char, index) => (
            <span
              key={index}
              className={`${getCharacterStyle(index)} px-0.5 py-1 rounded transition-all duration-100 ${
                index === userInput.length ? 'border-l-2 border-white animate-pulse' : ''
              }`}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Commence à taper ici..."
          disabled={isEnded}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all font-mono text-lg"
          autoComplete="off"
          spellCheck="false"
        />
        
        {/* Error indicators */}
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm text-center"
          >
            {errors.length} erreur{errors.length > 1 ? 's' : ''} détectée{errors.length > 1 ? 's' : ''}
          </motion.div>
        )}
      </div>

      {/* Tips */}
      {!isTypingStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-400 text-sm space-y-2"
        >
          <p>💡 Astuce: Regarde le texte, pas le clavier!</p>
          <p>🎯 La précision compte autant que la vitesse</p>
        </motion.div>
      )}

      {/* Encouragement */}
      {isTypingStarted && progress > 50 && progress < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-yellow-400 text-sm"
        >
          🔥 Tu y es presque! Plus que {sentence.length - userInput.length} caractères!
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