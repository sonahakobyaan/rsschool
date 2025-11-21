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