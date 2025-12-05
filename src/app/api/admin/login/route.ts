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
      // Return success without creating a specific session
      return Response.json({
        success: true,
        message: 'Login successful'
      });
    } else {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'An error occurred during login' }, { status: 500 });
  }
}