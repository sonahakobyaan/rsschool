// api.ts
import type { Product } from "@/types/product";

export const BASE_URL = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com';

// Module-level cache
let cachedFavorites: Product[] | null = null;

export async function fetchFavorites(): Promise<Product[]> {
  if (cachedFavorites) return cachedFavorites; // return cached data if exists

  try {
    const response = await fetch(`${BASE_URL}/products/favorites`);
    if (!response.ok) {
      throw new Error(`Failed to fetch favorites: ${response.status}`);
    }
    const result = await response.json();
    cachedFavorites = result.data.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      imageUrl: item.imageUrl || "/coffees/default.jpg",
      isFavorite: true,
    }));
    return cachedFavorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}
