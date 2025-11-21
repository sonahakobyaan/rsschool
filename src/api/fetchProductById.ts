import type { Product, Size, Additive, RawProduct } from "@/types/product";
import { toFloat } from "@/utils/toFloat";

const productDetailCache = new Map<string, Product>();

export async function fetchProductById(
  id: string | number,
  BASE_URL: string
): Promise<Product> {
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
    const item: RawProduct = result.data;

    const product: Product = {
      id: item.id.toString(),
      name: item.name,
      description: item.description ?? "",
      price: toFloat(item.price),
      discountPrice: item.discountPrice
        ? toFloat(item.discountPrice)
        : undefined,
      category: item.category ?? "uncategorized",
      isFavorite: false,

      sizes: item.sizes
        ? Object.fromEntries(
            Object.entries(item.sizes).map(([key, size]): [string, Size] => [
              key,
              {
                size: size.size ?? "",
                price: toFloat(size.price),
                discountPrice: size.discountPrice
                  ? toFloat(size.discountPrice)
                  : undefined,
              },
            ])
          )
        : undefined,

      additives: item.additives?.map(
        (add): Additive => ({
          name: add.name,
          price: toFloat(add.price),
          discountPrice: add.discountPrice
            ? toFloat(add.discountPrice)
            : undefined,
        })
      ),
    };

    productDetailCache.set(cacheKey, product);
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}
