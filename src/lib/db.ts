import { Game, AdminUser } from './types';
import { hashPassword } from './auth';

// In-memory storage for development purposes
// In production, you would connect to a real database
let games: Game[] = [];
let adminUsers: AdminUser[] = [];

// Session store for authentication
interface Session {
  userId: string;
  expires: Date;
}

let sessions: { [key: string]: Session } = {};

// Initialize with a default admin user for testing
// Using a pre-hashed password for 'admin123' for immediate availability
const defaultHashedPassword = '$2b$10$X0GxEMrK3gD2UuG1Vi9COOgg.89VTcNPc21M0eR2ZsPN/w0kTfSQ.'; // bcrypt hash for 'admin123'
if (adminUsers.length === 0) {
  const defaultAdmin: AdminUser = {
    id: '1',
    username: 'admin',
    password: defaultHashedPassword,
    createdAt: new Date(),
  };
  adminUsers.push(defaultAdmin);
}

export const db = {
  // Game operations
  getAllGames: (): Game[] => [...games],

  getGameById: (id: string): Game | undefined => {
    return games.find(game => game.id === id);
  },

  addGame: (game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>): Game => {
    const newGame: Game = {
      ...game,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    games.push(newGame);
    return newGame;
  },

  updateGame: (id: string, updates: Partial<Omit<Game, 'id' | 'createdAt'>>): Game | undefined => {
    const gameIndex = games.findIndex(game => game.id === id);
    if (gameIndex === -1) return undefined;

    games[gameIndex] = {
      ...games[gameIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return games[gameIndex];
  },

  deleteGame: (id: string): boolean => {
    const initialLength = games.length;
    games = games.filter(game => game.id !== id);
    return games.length !== initialLength;
  },

  // Admin user operations
  getAdminByUsername: (username: string): AdminUser | undefined => {
    return adminUsers.find(user => user.username === username);
  },

  addAdmin: async (admin: Omit<AdminUser, 'id' | 'createdAt'>): Promise<AdminUser> => {
    const hashedPassword = await hashPassword(admin.password);
    const newAdmin: AdminUser = {
      username: admin.username,
      password: hashedPassword,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    adminUsers.push(newAdmin);
    return newAdmin;
  },

  // Session operations
  createSession: (userId: string): string => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expires = new Date();
    expires.setDate(expires.getDate() + 1); // 24 hour expiration

    sessions[sessionId] = {
      userId,
      expires
    };

    return sessionId;
  },

  validateSession: (sessionId: string): boolean => {
    const session = sessions[sessionId];
    if (!session) {
      return false;
    }

    // Check if session is expired
    if (session.expires < new Date()) {
      // Clean up expired session
      delete sessions[sessionId];
      return false;
    }

    return true;
  },

  deleteSession: (sessionId: string): void => {
    delete sessions[sessionId];
  }
};