import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authCookie = request.headers.get('cookie');
    let hasAuthToken = false;

    if (authCookie) {
      const cookies = authCookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'auth_token') {
          hasAuthToken = true;
          break;
        }
      }
    }

    if (!hasAuthToken) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'all', 'pending', 'approved'
    const sort = searchParams.get('sort') || 'newest';

    let query = supabase
      .from('reviews')
      .select(`
        *,
        games (
          title
        )
      `);

    // Filter by status
    if (status === 'pending') {
      query = query.eq('approved', false);
    } else if (status === 'approved') {
      query = query.eq('approved', true);
    }

    // Sort results
    if (sort === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (sort === 'highest') {
      query = query.order('rating', { ascending: false });
    } else if (sort === 'lowest') {
      query = query.order('rating', { ascending: true });
    } else {
      // Default: newest
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    // Format the response
    const reviews = data.map((review: any) => ({
      id: review.id,
      gameId: review.game_id,
      userName: review.user_name,
      rating: review.rating,
      reviewText: review.review_text,
      approved: review.approved,
      createdAt: review.created_at,
      gameTitle: review.games?.title,
    }));

    return Response.json({ reviews });
  } catch (error) {
    console.error('Error in reviews API:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}