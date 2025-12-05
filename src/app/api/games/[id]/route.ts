import { NextRequest } from 'next/server';
import { db } from '../../../../lib/db';
import { Game } from '../../../../lib/types';

// GET: Get a single game by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const game = db.getGameById(params.id);

    if (!game) {
      return Response.json({ error: 'Game not found' }, { status: 404 });
    }

    return Response.json({ game });
  } catch (error) {
    console.error('Error fetching game:', error);
    return Response.json({ error: 'Failed to fetch game' }, { status: 500 });
  }
}

// PUT: Update a game
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const updatedGame = db.updateGame(params.id, {
      title,
      description,
      imageUrl,
    });

    if (!updatedGame) {
      return Response.json({ error: 'Game not found' }, { status: 404 });
    }

    return Response.json({ game: updatedGame, message: 'Game updated successfully' });
  } catch (error) {
    console.error('Error updating game:', error);
    return Response.json({ error: 'Failed to update game' }, { status: 500 });
  }
}

// DELETE: Delete a game
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const success = db.deleteGame(params.id);

    if (!success) {
      return Response.json({ error: 'Game not found' }, { status: 404 });
    }

    return Response.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    return Response.json({ error: 'Failed to delete game' }, { status: 500 });
  }
}