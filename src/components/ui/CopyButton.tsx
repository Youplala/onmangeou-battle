'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label = "Copier", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      disabled={copied}
      className={`relative px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-display font-bold rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed ${className}`}
      whileHover={{ scale: copied ? 1 : 1.05 }}
      whileTap={{ scale: copied ? 1 : 0.95 }}
    >
      {/* Background animation */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 bg-green-500"
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="copied"
              initial={{ scale: 0, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 90 }}
              className="flex items-center gap-2"
            >
              ✓ Copié!
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center gap-2"
            >
              📋 {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Ripple effect */}
      {copied && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-white rounded-lg"
        />
      )}
    </motion.button>
  );
}