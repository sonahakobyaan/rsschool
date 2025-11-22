import { handleConfirmOrder } from "@/api/handleConfirmOrder";
import { fetchProductById } from "@/api/fetchProductById";
import { handleRegister } from "@/api/handleRegister";
import { fetchFavorites } from "@/api/fetchFavorites";
import { fetchProducts } from "@/api/fetchProducts";
import { handleSignIn } from "@/api/handleSignIn";

export const api = {
  handleConfirmOrder,
  fetchProductById,
  handleRegister,
  fetchFavorites,
  fetchProducts,
  handleSignIn,
};
