export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  categories?: Category[];
  platforms?: Platform[];
  averageRating?: number;
  totalRatings?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Platform {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  gameId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  reviewText: string;
  approved: boolean;
  createdAt: Date;
}

export interface Rating {
  id: string;
  gameId: string;
  averageRating: number;
  totalRatings: number;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string; // This should be hashed
  createdAt: Date;
}