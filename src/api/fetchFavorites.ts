import type {
  Product,
  FavoriteProductResponse,
  ApiResponse,
} from "@/types/product";
import { BASE_URL } from "@/api/constant.ts";
import { toFloat } from "@/utils/toFloat";
import { keepCache } from "@/utils/cache.ts";

let cachedFavorites: Product[] = [];

export async function fetchFavorites(): Promise<Product[]> {
  if (cachedFavorites.length > 0) {
    return cachedFavorites;
  }

  try {
    const response = await fetch(`${BASE_URL}/products/favorites`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = (await response.json()) as ApiResponse;

    const favorites = result.data as FavoriteProductResponse[];

    const products: Product[] = favorites.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      description: item.description,
      price: toFloat(item.price),
      discountPrice:
        item.discountPrice != null ? toFloat(item.discountPrice) : undefined,
      category: item.category,
      isFavorite: true,
    }));

    if (keepCache()) {
      cachedFavorites = products;
    }

    return keepCache() ? cachedFavorites : products;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}
