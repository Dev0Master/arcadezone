import { Game, AdminUser, Category, Review, Rating } from './types';
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
  },

  // Category operations
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: new Date(row.created_at),
    }));
  },

  async addCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) {
      console.error('Error adding category:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: new Date(data.created_at),
    };
  },

  // Enhanced game operations with categories and ratings
  async getGameByIdWithDetails(id: string): Promise<Game | undefined> {
    // First get the game with categories
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .select(`
        *,
        categories (
          id,
          name,
          description,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (gameError) {
      console.error('Error fetching game:', gameError);
      return undefined;
    }

    // Get rating information
    const { data: ratingData } = await supabase
      .from('ratings')
      .select('average_rating, total_ratings')
      .eq('game_id', id)
      .single();

    return {
      id: gameData.id,
      title: gameData.title,
      description: gameData.description,
      imageUrl: gameData.image_url || undefined,
      createdAt: new Date(gameData.created_at),
      updatedAt: new Date(gameData.updated_at),
      categories: gameData.categories?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        createdAt: new Date(cat.created_at),
      })) || [],
      averageRating: ratingData?.average_rating,
      totalRatings: ratingData?.total_ratings || 0,
    };
  },

  async getGamesByCategory(categoryId: string): Promise<Game[]> {
<<<<<<< HEAD
    // First get the game IDs for this category
    const { data: gameIds, error: gameIdsError } = await supabase
      .from('game_categories')
      .select('game_id')
      .eq('category_id', categoryId);

    if (gameIdsError) {
      console.error('Error fetching game IDs for category:', gameIdsError);
      return [];
    }

    if (!gameIds || gameIds.length === 0) {
      return [];
    }

    // Then get the games
=======
>>>>>>> f9250e10cc08f6fdf91e955dae0ee825ff9e1717
    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        categories (
          id,
          name,
          description,
          created_at
        )
      `)
<<<<<<< HEAD
      .in('id', gameIds.map(g => g.game_id))
=======
      .in('id',
        supabase
          .from('game_categories')
          .select('game_id')
          .eq('category_id', categoryId)
      )
>>>>>>> f9250e10cc08f6fdf91e955dae0ee825ff9e1717
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching games by category:', error);
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      categories: row.categories?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        createdAt: new Date(cat.created_at),
      })) || [],
    }));
  },

  async searchGames(query: string, categoryId?: string): Promise<Game[]> {
<<<<<<< HEAD
    // If we have a category filter, we need to get the game IDs first
    if (categoryId) {
      const { data: gameIds, error: gameIdsError } = await supabase
        .from('game_categories')
        .select('game_id')
        .eq('category_id', categoryId);

      if (gameIdsError) {
        console.error('Error fetching game IDs for category:', gameIdsError);
        return [];
      }

      if (!gameIds || gameIds.length === 0) {
        return [];
      }

      let supabaseQuery = supabase
        .from('games')
        .select(`
          *,
          categories (
            id,
            name,
            description,
            created_at
          )
        `)
        .in('id', gameIds.map(g => g.game_id));

      // Add text search
      if (query) {
        supabaseQuery = supabaseQuery
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data, error } = await supabaseQuery
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching games:', error);
        return [];
      }

      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        imageUrl: row.image_url || undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        categories: row.categories?.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          createdAt: new Date(cat.created_at),
        })) || [],
      }));
    }

    // No category filter - simpler query
=======
>>>>>>> f9250e10cc08f6fdf91e955dae0ee825ff9e1717
    let supabaseQuery = supabase
      .from('games')
      .select(`
        *,
        categories (
          id,
          name,
          description,
          created_at
        )
      `);

    // Add text search
    if (query) {
      supabaseQuery = supabaseQuery
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

<<<<<<< HEAD
=======
    // Add category filter
    if (categoryId) {
      supabaseQuery = supabaseQuery
        .in('id',
          supabase
            .from('game_categories')
            .select('game_id')
            .eq('category_id', categoryId)
        );
    }

>>>>>>> f9250e10cc08f6fdf91e955dae0ee825ff9e1717
    const { data, error } = await supabaseQuery
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching games:', error);
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      imageUrl: row.image_url || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      categories: row.categories?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        createdAt: new Date(cat.created_at),
      })) || [],
    }));
  },

  // Review operations
  async getReviewsByGame(gameId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('game_id', gameId)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      gameId: row.game_id,
      userName: row.user_name,
      rating: row.rating,
      reviewText: row.review_text,
      approved: row.approved,
      createdAt: new Date(row.created_at),
    }));
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single();

    if (error) {
      console.error('Error adding review:', error);
      throw error;
    }

    // Update rating
    await this.updateGameRating(review.gameId);

    return {
      id: data.id,
      gameId: data.game_id,
      userName: data.user_name,
      rating: data.rating,
      reviewText: data.review_text,
      approved: data.approved,
      createdAt: new Date(data.created_at),
    };
  },

  async updateGameRating(gameId: string): Promise<void> {
    // Calculate new average rating
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('game_id', gameId)
      .eq('approved', true);

    if (!reviews || reviews.length === 0) return;

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    // Update or insert rating
    await supabase
      .from('ratings')
      .upsert({
        game_id: gameId,
        average_rating: averageRating,
        total_ratings: reviews.length,
        updated_at: new Date().toISOString(),
      });
  }
};