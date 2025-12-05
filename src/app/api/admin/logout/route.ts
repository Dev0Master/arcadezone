import { NextRequest } from 'next/server';
import { db } from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    // Get the session token from the request cookies
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

    // If we have a session ID, delete it from the session store
    if (sessionId) {
      db.deleteSession(sessionId);
    }

    // Return a response that tells the client to clear the auth cookie
    return new Response(
      JSON.stringify({ message: 'Logged out successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ error: 'An error occurred during logout' }, { status: 500 });
  }
}