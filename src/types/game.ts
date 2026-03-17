export interface Player {
  id: string;
  name: string;
  color: string;
  emoji: string;
  isHost: boolean;
  restaurant?: Restaurant;
  score: number;
  isReady: boolean;
  lastSeen: number;
}

export interface Restaurant {
  id: string;
  name: string;
  url?: string;
  submittedBy: string;
  emoji: string;
}

export interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  restaurants: Restaurant[];
  currentGame?: string;
  gameState: 'waiting' | 'lobby' | 'playing' | 'results' | 'tournament' | 'finished';
  createdAt: number;
  settings: GameSettings;
  winner?: Restaurant;
  tournament?: TournamentBracket;
}

export interface GameSettings {
  maxPlayers: number;
  gameTimeLimit: number; // seconds
  minigamesCount: number;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  type: 'chat' | 'system' | 'game';
}

export interface GameResult {
  playerId: string;
  score: number;
  time?: number;
  accuracy?: number;
  position: number;
}

export interface MiniGame {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: string;
  maxDuration: number;
}

export interface TournamentBracket {
  rounds: TournamentRound[];
  currentRound: number;
  winner?: Restaurant;
}

export interface TournamentRound {
  matches: TournamentMatch[];
  roundName: string;
}

export interface TournamentMatch {
  id: string;
  restaurant1: Restaurant;
  restaurant2: Restaurant;
  winner?: Restaurant;
  game: MiniGame;
  players: Player[];
  results?: GameResult[];
  status: 'pending' | 'playing' | 'finished';
}

// Socket Events
export interface SocketEvents {
  // Room events
  'room:create': (data: { roomName: string; playerName: string; playerEmoji: string }) => void;
  'room:join': (data: { roomId: string; playerName: string; playerEmoji: string }) => void;
  'room:leave': (data: { roomId: string; playerId: string }) => void;
  'room:update': (room: GameRoom) => void;
  
  // Player events
  'player:submit-restaurant': (data: { roomId: string; playerId: string; restaurant: Omit<Restaurant, 'id'> }) => void;
  'player:ready': (data: { roomId: string; playerId: string }) => void;
  
  // Game events
  'game:start': (data: { roomId: string; game: MiniGame }) => void;
  'game:countdown': (data: { roomId: string; count: number }) => void;
  'game:action': (data: { roomId: string; playerId: string; action: any }) => void;
  'game:result': (data: { roomId: string; results: GameResult[] }) => void;
  'game:end': (data: { roomId: string; winner: Player }) => void;
  
  // Tournament events
  'tournament:start': (data: { roomId: string; bracket: TournamentBracket }) => void;
  'tournament:match-start': (data: { roomId: string; match: TournamentMatch }) => void;
  'tournament:match-end': (data: { roomId: string; matchId: string; winner: Restaurant }) => void;
  'tournament:winner': (data: { roomId: string; winner: Restaurant }) => void;
  
  // Chat events
  'chat:message': (data: { roomId: string; playerId: string; message: string }) => void;
  'chat:new-message': (message: ChatMessage) => void;
  
  // Error events
  'error': (data: { message: string; code?: string }) => void;
}