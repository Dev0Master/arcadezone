import { Game, AdminUser } from './types';
import { hashPassword } from './auth';
import { supabase } from './supabase';

export const db = {
  // Game operations
  async getAllGames(): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching games:', error);
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  },

  async getGameById(id: string): Promise<Game | undefined> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching game:', error);
      return undefined;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async addGame(game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>): Promise<Game> {
    // Insert the new game and return the created record
    const { data, error } = await supabase
      .from('games')
      .insert([
        {
          title: game.title,
          description: game.description,
          image_url: game.imageUrl,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding game:', error);
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async updateGame(id: string, updates: Partial<Omit<Game, 'id' | 'createdAt'>>): Promise<Game | undefined> {
    const { data, error } = await supabase
      .from('games')
      .update({
        title: updates.title,
        description: updates.description,
        image_url: updates.imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating game:', error);
      return undefined;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  },

  async deleteGame(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting game:', error);
      return false;
    }

    return true;
  },

  // Admin user operations
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, username, password, created_at')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching admin user:', error);
      return undefined;
    }

    if (!data) {
      return undefined;
    }

    return {
      id: data.id,
      username: data.username,
      password: data.password,
      createdAt: new Date(data.created_at),
    };
  },

  async addAdmin(admin: Omit<AdminUser, 'id' | 'createdAt'>): Promise<AdminUser> {
    const hashedPassword = await hashPassword(admin.password);

    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        {
          username: admin.username,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding admin:', error);
      throw error;
    }

    return {
      id: data.id,
      username: data.username,
      password: data.password,
      createdAt: new Date(data.created_at),
    };
  },

  // Session operations are not implemented in this version
  // We'll rely on authentication state managed by the frontend
  createSession: (userId: string): string => {
    // Generate a client-side identifier (not stored server-side)
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return sessionId;
  },

  validateSession: (sessionId: string): boolean => {
    // Since there are no persistent sessions, we simply return true
    // Authentication will be checked via the login status
    return true;
  },

  deleteSession: (sessionId: string): void => {
    // No server-side session to delete
  }
};