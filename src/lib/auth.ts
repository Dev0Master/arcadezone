import { db } from './db';
import { compare, hash } from 'bcryptjs';

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const user = await db.getAdminByUsername(username);
    if (!user) return false;

    // Compare the provided password with the stored hash
    return await compare(password, user.password);
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await hash(password, saltRounds);
};