import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Log request details for debugging
    console.log('Admin reviews API called');
    console.log('URL:', request.url);

    // Check authentication
    const authCookie = request.headers.get('cookie');
    console.log('Auth cookie present:', !!authCookie);
    let isValidAuthToken = false;

    if (authCookie) {
      const cookies = authCookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'auth_token' && value && value.startsWith('auth_')) {
          // Basic validation: token should start with 'auth_' and have some content
          isValidAuthToken = true;
          break;
        }
      }
    }

    if (!isValidAuthToken) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'all', 'pending', 'approved'
    const sort = searchParams.get('sort') || 'newest';

    let query = supabaseAdmin
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
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return Response.json({
        error: 'Failed to fetch reviews',
        details: error.message,
        code: error.code
      }, { status: 500 });
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