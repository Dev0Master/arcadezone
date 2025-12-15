import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { Category } from '@/lib/types';

// GET: Get all categories
export async function GET() {
  try {
    const categories = await db.getCategories();

    return Response.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST: Add a new category (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication by verifying the presence of auth token cookie
    const authCookie = request.headers.get('cookie');
    let hasAuthToken = false;

    if (authCookie) {
      const cookies = authCookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'auth_token') {
          hasAuthToken = true;
          break;
        }
      }
    }

    // Return unauthorized if no auth token is found
    if (!hasAuthToken) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!name) {
      return Response.json({ error: 'Category name is required' }, { status: 400 });
    }

    const newCategory: Omit<Category, 'id' | 'createdAt'> = {
      name,
      description: description || undefined,
    };

    const category = await db.addCategory(newCategory);

    return Response.json({
      category,
      message: 'Category added successfully'
    });
  } catch (error) {
    console.error('Error adding category:', error);
    return Response.json({ error: 'Failed to add category' }, { status: 500 });
  }
}