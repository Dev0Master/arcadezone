import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { Review } from '@/lib/types';

// GET: Get all reviews for a game
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviews = await db.getReviewsByGame(id);

    return Response.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST: Add a new review for a game
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewData = await request.json();

    // Validate required fields
    if (!reviewData.userName || !reviewData.rating || !reviewData.reviewText) {
      return Response.json(
        { error: 'Name, rating, and review text are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return Response.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify game exists
    const game = await db.getGameById(id);
    if (!game) {
      return Response.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    const newReview: Omit<Review, 'id' | 'createdAt'> = {
      gameId: id,
      userName: reviewData.userName,
      rating: reviewData.rating,
      reviewText: reviewData.reviewText,
      approved: reviewData.approved || false,
    };

    const review = await db.addReview(newReview);

    return Response.json({
      review,
      message: review.approved
        ? 'Review added successfully!'
        : 'Review submitted! It will be visible after approval.'
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return Response.json({ error: 'Failed to add review' }, { status: 500 });
  }
}