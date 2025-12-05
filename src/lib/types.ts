export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string; // This should be hashed
  createdAt: Date;
}