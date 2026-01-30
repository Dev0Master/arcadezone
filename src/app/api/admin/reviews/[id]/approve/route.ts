import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST: Approve a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authCookie = request.headers.get('cookie');
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

    const { id } = await params;

    // Get the review to update game rating
    const { data: review, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .select('game_id')
      .eq('id', id)
      .single();

    if (reviewError || !review) {
      return Response.json({ error: 'Review not found' }, { status: 404 });
    }

    // Update the review to approved
    const { error } = await supabaseAdmin
      .from('reviews')
      .update({ approved: true })
      .eq('id', id);

    if (error) {
      console.error('Error approving review:', error);
      return Response.json({ error: 'Failed to approve review' }, { status: 500 });
    }

    // Update the game rating
    await updateGameRating(review.game_id);

    return Response.json({ message: 'Review approved successfully' });
  } catch (error) {
    console.error('Error in approve review API:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to update game rating
async function updateGameRating(gameId: string) {
  try {
    // Calculate new average rating
    const { data: reviews, error } = await supabaseAdmin
      .from('reviews')
      .select('rating')
      .eq('game_id', gameId)
      .eq('approved', true);

    if (error) {
      console.error('Error fetching reviews for rating update:', error);
      return;
    }

    if (!reviews || reviews.length === 0) {
      // Remove rating entry if no approved reviews
      await supabaseAdmin
        .from('ratings')
        .delete()
        .eq('game_id', gameId);
      return;
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    // Update or insert rating
    await supabaseAdmin
      .from('ratings')
      .upsert({
        game_id: gameId,
        average_rating: averageRating,
        total_ratings: reviews.length,
        updated_at: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Error updating game rating:', error);
  }
}