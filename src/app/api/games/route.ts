import { NextRequest } from 'next/server';
import { db } from '../../../lib/db';
import { Game } from '../../../lib/types';

export async function GET(request: NextRequest) {
  try {
    const games = db.getAllGames();

    // Return games in JSON format
    return Response.json({
      games,
      count: games.length
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return Response.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication by validating session token from cookie
    const authCookie = request.headers.get('cookie');
    let sessionId = null;

    if (authCookie) {
      const cookies = authCookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'auth_token') {
          sessionId = value;
          break;
        }
      }
    }

    // Validate session
    if (!sessionId || !db.validateSession(sessionId)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, imageUrl } = await request.json();

    if (!title || !description) {
      return Response.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const newGame = db.addGame({
      title,
      description,
      imageUrl,
    });

    return Response.json({ game: newGame, message: 'Game added successfully' });
  } catch (error) {
    console.error('Error adding game:', error);
    return Response.json({ error: 'Failed to add game' }, { status: 500 });
  }
}