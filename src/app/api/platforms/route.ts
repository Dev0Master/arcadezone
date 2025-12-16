import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const platforms = await db.getPlatforms();

    // Return platforms in JSON format
    return Response.json({
      platforms,
      count: platforms.length
    });
  } catch (error) {
    console.error('Error fetching platforms:', error);
    return Response.json({ error: 'Failed to fetch platforms' }, { status: 500 });
  }
}

// Platforms are read-only - no POST, PUT, or DELETE methods allowed
export async function POST() {
  return Response.json({ error: 'Platforms cannot be modified' }, { status: 405 });
}

export async function PUT() {
  return Response.json({ error: 'Platforms cannot be modified' }, { status: 405 });
}

export async function DELETE() {
  return Response.json({ error: 'Platforms cannot be modified' }, { status: 405 });
}