import { fetchProductById } from "@/api/fetchProductById";
import { fetchFavorites } from "@/api/fetchFavorites";
import { fetchProducts } from "@/api/fetchProducts";
import { handleSignIn } from "@/api/handleSignIn";
import { handleRegister } from "@/api/handleRegister";

export const api = {
  fetchProductById,
  handleRegister,
  fetchFavorites,
  fetchProducts,
  handleSignIn,
};
