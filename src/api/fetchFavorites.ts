import type {
  Product,
  FavoriteProductResponse,
  ApiResponse,
} from "@/types/product";
import { toFloat } from "@/utils/toFloat";

let cachedFavorites: Product[] = [];

export async function fetchFavorites(BASE_URL: string): Promise<Product[]> {
  if (cachedFavorites.length > 0) {
    return cachedFavorites;
  }

  try {
    const response = await fetch(`${BASE_URL}/products/favorites`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    cachedFavorites = result.data.map(
      (item: FavoriteProductResponse): Product => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        price: toFloat(item.price),
        discountPrice:
          item.discountPrice != null ? toFloat(item.discountPrice) : undefined,
        category: item.category,
        isFavorite: true,
      })
    );

    return cachedFavorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}
