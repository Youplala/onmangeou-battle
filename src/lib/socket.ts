'use client';

import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '@/types/game';

// For development, this will connect to a local server
// For production on GitHub Pages, we'll use mock/local logic
const SOCKET_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3001' 
  : null; // No real socket in production

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

export function initSocket(): Socket | null {
  if (typeof window === 'undefined') return null;
  
  // Don't create real socket in production (GitHub Pages can't host Socket.IO server)
  if (!SOCKET_URL) {
    console.log('Running in static mode - no real-time features');
    return null;
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    socket.on('connect', () => {
      console.log('Connected to game server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from game server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Type-safe socket event emitters
export function emitSocketEvent<K extends keyof SocketEvents>(
  event: K,
  data: Parameters<SocketEvents[K]>[0]
) {
  if (socket?.connected) {
    socket.emit(event, data);
  } else {
    console.warn(`Cannot emit ${event}: socket not connected`);
  }
}

// Mock socket for production/testing
export class MockSocket {
  private listeners: Map<string, Function[]> = new Map();
  
  emit(event: string, data?: any) {
    console.log(`Mock socket emit: ${event}`, data);
    // Simulate server responses for testing
    setTimeout(() => {
      this.simulateResponse(event, data);
    }, 100);
  }
  
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }
    
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  private simulateResponse(event: string, data: any) {
    // Simulate server responses for development/testing
    switch (event) {
      case 'room:create':
        this.trigger('room:update', {
          id: 'mock-room-' + Date.now(),
          name: data.roomName,
          players: [{
            id: 'player-1',
            name: data.playerName,
            color: '#8B5CF6',
            emoji: data.playerEmoji,
            isHost: true,
            score: 0,
            isReady: false,
            lastSeen: Date.now()
          }],
          restaurants: [],
          gameState: 'lobby',
          createdAt: Date.now(),
          settings: {
            maxPlayers: 8,
            gameTimeLimit: 30,
            minigamesCount: 3
          }
        });
        break;
      // Add more mock responses as needed
    }
  }
  
  private trigger(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

export function createMockSocket(): MockSocket {
  return new MockSocket();
}