import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
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