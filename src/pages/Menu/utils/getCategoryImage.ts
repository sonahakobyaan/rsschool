import { dessert } from "@/assets/dessert/dessert.ts";
import { coffee } from "@/assets/coffee/coffee.ts";
import { tea } from "@/assets/tea/tea.ts";
const getCategoryImage = (category: string, index: number) => {
  const imageIndex = index + 1;
  switch (category) {
    case "coffee":
      return coffee[imageIndex];
    case "tea":
      return tea[imageIndex];
    case "dessert":
      return dessert[imageIndex];
    default:
      return "";
  }
};

export default getCategoryImage;
