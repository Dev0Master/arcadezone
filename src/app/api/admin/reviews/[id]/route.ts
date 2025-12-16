import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

// DELETE: Delete a review (reject)
export async function DELETE(
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

    // Delete the review
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting review:', error);
      return Response.json({ error: 'Failed to delete review' }, { status: 500 });
    }

    return Response.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error in delete review API:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}