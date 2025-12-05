import { NextRequest } from 'next/server';
import { login } from '../../../../lib/auth';
import { db } from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const isValid = await login(username, password);

    if (isValid) {
      // Create a session in the database
      const sessionId = db.createSession(username); // In a real app, use user ID instead of username

      // Return the session token
      // Note: We can't set cookies in API routes in Next.js App Router the traditional way
      // The client will handle authentication in another way
      return Response.json({
        success: true,
        message: 'Login successful',
        token: sessionId
      });
    } else {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}