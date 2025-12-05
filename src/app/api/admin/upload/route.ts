import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type (only images)
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Create a unique filename
    const bytes = await crypto.getRandomValues(new Uint8Array(16));
    const buffer = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    const ext = path.extname(file.name) || '.jpg'; // Default to .jpg if no extension
    const filename = `${buffer}${ext}`;

    // Convert file to buffer
    const bufferData = Buffer.from(await file.arrayBuffer());

    // Define upload path (public/images)
    const uploadDir = path.join(process.cwd(), 'public', 'images');

    // Create directory if it doesn't exist
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    // Write the file
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, bufferData);

    // Return the URL for the uploaded image
    return Response.json({
      imageUrl: `/images/${filename}`,
      filename
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return Response.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}