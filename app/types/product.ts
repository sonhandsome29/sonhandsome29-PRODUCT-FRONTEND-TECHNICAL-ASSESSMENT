export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  brand: string;
  color: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  stock: number;
  badge: string;
  sku: string;
}

export interface ProductListResult {
  items: Product[];
  total: number;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: number;
    name: string;
    username: string;
  };
}
