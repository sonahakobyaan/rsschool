import type { Product } from "@/types/product";
import { toFloat } from "@/utils/toFloat";
import { BASE_URL } from "@/api/constant.ts";

let cachedProducts: Product[] = [];

export async function fetchProducts(): Promise<Product[]> {
  if (cachedProducts.length > 0) return cachedProducts;

  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const { data } = (await response.json()) as {
      data: Array<{
        id: number | string;
        name: string;
        description: string;
        price: number | string;
        discountPrice?: number | string | null;
        category: string;
      }>;
    };

    cachedProducts = data.map((item) => ({
      id: String(item.id),
      name: item.name,
      description: item.description,
      price: toFloat(item.price),
      discountPrice:
        item.discountPrice != null ? toFloat(item.discountPrice) : undefined,
      category: item.category,
      isFavorite: false,
    }));

    return cachedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
