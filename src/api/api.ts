import { fetchProductById } from "@/api/fetchProductById";
import { fetchFavorites } from "@/api/fetchFavorites";
import { fetchProducts } from "@/api/fetchProducts";

export const BASE_URL =
  "https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com";

export type ApiConfig = {
  baseUrl?: string;
};

export const api = {
  fetchProducts: (config?: ApiConfig) =>
    fetchProducts(config?.baseUrl ?? BASE_URL),

  fetchProductById: (id: string | number, config?: ApiConfig) =>
    fetchProductById(id, config?.baseUrl ?? BASE_URL),

  fetchFavorites: (config?: ApiConfig) =>
    fetchFavorites(config?.baseUrl ?? BASE_URL),
};
