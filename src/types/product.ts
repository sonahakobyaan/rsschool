export interface Size {
  size: string;
  price: number;
  discountPrice?: number;
}

export interface Additive {
  name: string;
  price: number;
  discountPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  isFavorite?: boolean;

  sizes?: Record<string, Size>;
  additives?: Additive[];
}

export interface FavoriteProductResponse {
  id: number | string;
  name: string;
  description: string;
  price: number | string;
  discountPrice?: number | string | null;
  category: string;
}

export interface ApiResponse {
  data: FavoriteProductResponse[];
}

export interface RawSize {
  size?: string;
  price: number | string;
  discountPrice?: number | string;
}

export interface RawAdditive {
  name: string;
  price: number | string;
  discountPrice?: number | string;
}

export interface RawProduct {
  id: string | number;
  name: string;
  description?: string;
  price: number | string;
  discountPrice?: number | string;
  category?: string;
  sizes?: Record<string, RawSize>;
  additives?: RawAdditive[];
}
