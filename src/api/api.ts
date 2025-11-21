// src/api/api.ts
import type { Product, Size, Additive } from "@/types/product";

export const BASE_URL =
  "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com";

// Cache
let cachedAllProducts: Product[] | null = null;
let cachedFavorites: Product[] | null = null;
const productDetailCache = new Map<string | number, Product>();

// Helper: convert API strings to numbers
const toFloat = (val: string | number | null | undefined): number => {
  if (val === null || val === undefined) return 0;
  return typeof val === "string" ? parseFloat(val) || 0 : val;
};

export async function fetchProducts(): Promise<Product[]> {
  if (cachedAllProducts) return cachedAllProducts;

  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();
    cachedAllProducts = result.data.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      price: toFloat(item.price),
      discountPrice: item.discountPrice ? toFloat(item.discountPrice) : undefined,
      category: item.category,
      isFavorite: false,
    }));

    return cachedAllProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function fetchFavorites(): Promise<Product[]> {
  if (cachedFavorites) return cachedFavorites;

  try {
    const response = await fetch(`${BASE_URL}/products/favorites`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();
    cachedFavorites = result.data.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      price: toFloat(item.price),
      discountPrice: item.discountPrice ? toFloat(item.discountPrice) : undefined,
      category: item.category,
      isFavorite: true,
    }));

    return cachedFavorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}

// NEW: Fetch full detailed product by ID
export async function fetchProductById(id: string | number): Promise<Product> {
  const cacheKey = id.toString();
  if (productDetailCache.has(cacheKey)) {
    return productDetailCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error("Product not found");
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    const item = result.data;

    const product: Product = {
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      price: toFloat(item.price),
      discountPrice: item.discountPrice ? toFloat(item.discountPrice) : undefined,
      category: item.category,
      isFavorite: false,

      // Full sizes with price/discount
      sizes: item.sizes
        ? Object.fromEntries(
            Object.entries(item.sizes).map(([key, size]: [string, any]) => [
              key,
              {
                size: size.size || "",
                price: toFloat(size.price),
                discountPrice: size.discountPrice ? toFloat(size.discountPrice) : undefined,
              } as Size,
            ])
          )
        : undefined,

      // Full additives
      additives: item.additives?.map((add: any): Additive => ({
        name: add.name,
        price: toFloat(add.price),
        discountPrice: add.discountPrice ? toFloat(add.discountPrice) : undefined,
      })),
    };

    productDetailCache.set(cacheKey, product);
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}