import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const categoryId = searchParams.get('category');

    const games = await db.searchGames(query, categoryId || undefined);

    return Response.json({
      games,
      count: games.length,
      query,
      category: categoryId
    });
  } catch (error) {
    console.error('Error searching games:', error);
    return Response.json({ error: 'Failed to search games' }, { status: 500 });
  }
}