import dessertImg from "@/assets/icons/dessert.png";
import coffeImg from "@/assets/icons/coffee.png";
import teaImg from "@/assets/icons/tea.png";

import { CATEGORIES } from "@/pages/Menu/consts/consts";

export type Category = (typeof CATEGORIES)[number];

export const categoryIcons: Record<Category, string> = {
  dessert: dessertImg,
  coffee: coffeImg,
  tea: teaImg,
};

export const categoryLabels: Record<Category, string> = {
  dessert: "Desserts",
  coffee: "Coffee",
  tea: "Tea",
};
