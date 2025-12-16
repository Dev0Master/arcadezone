import { Game, AdminUser, Category, Review, Rating, Platform } from './types';
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

  async addGame(game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'> & { categoryIds?: string[]; platformIds?: string[]; initialRating?: number }): Promise<Game> {
    // Use a transaction to ensure all operations succeed or fail together
    const { data: newGame, error: gameError } = await supabase
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

    if (gameError) {
      console.error('Error adding game:', gameError);
      throw gameError;
    }

    // Handle categories if provided
    if (game.categoryIds && game.categoryIds.length > 0) {
      const categoryEntries = game.categoryIds.map(categoryId => ({
        game_id: newGame.id,
        category_id: categoryId,
      }));

      const { error: categoryError } = await supabase
        .from('game_categories')
        .insert(categoryEntries);

      if (categoryError) {
        console.error('Error adding game categories:', categoryError);
        // Delete the game if category assignment fails
        await supabase.from('games').delete().eq('id', newGame.id);
        throw categoryError;
      }
    }

    // Handle platforms if provided
    if (game.platformIds && game.platformIds.length > 0) {
      const platformEntries = game.platformIds.map(platformId => ({
        game_id: newGame.id,
        platform_id: platformId,
      }));

      const { error: platformError } = await supabase
        .from('game_platforms')
        .insert(platformEntries);

      if (platformError) {
        console.error('Error adding game platforms:', platformError);
        // Don't fail the operation if platform assignment fails, just log it
      }
    }

    // Handle initial rating if provided and greater than 0
    if (game.initialRating && game.initialRating > 0) {
      const { error: ratingError } = await supabase
        .from('ratings')
        .insert([
          {
            game_id: newGame.id,
            average_rating: game.initialRating,
            total_ratings: 1,
          },
        ]);

      if (ratingError) {
        console.error('Error adding initial rating:', ratingError);
        // Don't fail the entire operation if rating fails, just log it
      }
    }

    return {
      id: newGame.id,
      title: newGame.title,
      description: newGame.description,
      imageUrl: newGame.image_url || undefined,
      createdAt: new Date(newGame.created_at),
      updatedAt: new Date(newGame.updated_at),
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
      .in('id', gameIds.map(g => g.game_id))
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

  // Platform operations (read-only)
  async getPlatforms(): Promise<Platform[]> {
    const { data, error } = await supabase
      .from('platforms')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching platforms:', error);
      // Return predefined platforms if database is not set up yet
      return [
        { id: 'pc', name: 'PC', code: 'PC', createdAt: new Date() },
        { id: 'ps4', name: 'PlayStation 4', code: 'PS4', createdAt: new Date() },
        { id: 'ps5', name: 'PlayStation 5', code: 'PS5', createdAt: new Date() },
        { id: 'xbox-one', name: 'Xbox One', code: 'XONE', createdAt: new Date() },
        { id: 'xbox-series', name: 'Xbox Series X/S', code: 'XSX', createdAt: new Date() },
        { id: 'switch', name: 'Nintendo Switch', code: 'SWITCH', createdAt: new Date() },
        { id: 'steam', name: 'Steam', code: 'STEAM', createdAt: new Date() },
        { id: 'epic', name: 'Epic Games Store', code: 'EPIC', createdAt: new Date() },
        { id: 'psp', name: 'PSP', code: 'PSP', createdAt: new Date() },
        { id: 'ps-vita', name: 'PS Vita', code: 'PSVITA', createdAt: new Date() },
        { id: 'mobile-ios', name: 'Mobile (iOS)', code: 'IOS', createdAt: new Date() },
        { id: 'mobile-android', name: 'Mobile (Android)', code: 'ANDROID', createdAt: new Date() },
        { id: 'stadia', name: 'Stadia', code: 'STADIA', createdAt: new Date() },
        { id: 'gog', name: 'GOG', code: 'GOG', createdAt: new Date() },
        { id: 'origin', name: 'Origin', code: 'ORIGIN', createdAt: new Date() },
        { id: 'uplay', name: 'Uplay', code: 'UPLAY', createdAt: new Date() },
        { id: 'battle-net', name: 'Battle.net', code: 'BLIZZ', createdAt: new Date() },
      ];
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      createdAt: new Date(row.created_at),
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