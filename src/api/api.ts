import { fetchProductById } from "@/api/fetchProductById";
import { fetchFavorites } from "@/api/fetchFavorites";
import { fetchProducts } from "@/api/fetchProducts";
import { login } from "@/api/handleSignIn";

export type ApiConfig = {
  baseUrl?: string;
};

export const api = {
  fetchProducts,
  fetchProductById,
  fetchFavorites,
  login,
};
