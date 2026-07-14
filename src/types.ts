export type Role = 'ROLE_ADMIN' | 'ROLE_USER' | string;

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  username: string;
  role: Role;
}

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export interface FestivalSummary {
  id: number;
  name: string;
  location: string;
  date: string;
  imageUrl?: string | null;
  shortDescription?: string | null;
}

export interface FestivalDetail {
  id: number;
  name: string;
  description?: string | null;
  location: string;
  date: string;
  imageUrl?: string | null;
  foods: Food[];
  drinks: Drink[];
}

export interface FestivalRequest {
  name: string;
  description: string;
  location: string;
  date: string;
  imageUrl: string;
}

export interface Food {
  id: number;
  name: string;
  price: number;
}

export interface FoodRequest {
  name: string;
  price: number;
}

export interface Drink {
  id: number;
  name: string;
  price: number;
}

export interface DrinkRequest {
  name: string;
  price: number;
}

export interface ProblemDetail {
  status?: number;
  title?: string;
  detail?: string;
  errors?: string[];
}
