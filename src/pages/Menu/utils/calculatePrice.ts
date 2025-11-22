import type { Product } from "@/types/product";
import { toFloat } from "@/utils/toFloat";

type ProductPrice = {
  selectedAdditives: string[];
  detailedProduct: Product;
  selectedSize: string;
  loggedIn: boolean;
};
export const calculatePrice = ({
  selectedAdditives,
  detailedProduct,
  selectedSize,
  loggedIn,
}: ProductPrice) => {
  if (!detailedProduct) return { base: 0, discount: 0, showDiscount: false };

  const sizeData = detailedProduct.sizes?.[selectedSize];
  const sizeBasePrice = sizeData?.price
    ? toFloat(sizeData.price)
    : toFloat(detailedProduct.price);

  const shouldApplyDiscount = loggedIn;

  const sizeDiscountPrice =
    shouldApplyDiscount && sizeData?.discountPrice
      ? toFloat(sizeData.discountPrice)
      : null;

  const additivesBaseTotal = selectedAdditives.reduce((sum, name) => {
    const additive = detailedProduct.additives?.find((a) => a.name === name);
    return sum + (additive?.price ? toFloat(additive.price) : 0);
  }, 0);

  const additivesDiscountTotal = selectedAdditives.reduce((sum, name) => {
    const additive = detailedProduct.additives?.find((a) => a.name === name);
    if (!shouldApplyDiscount) {
      return sum + (additive?.price ? toFloat(additive.price) : 0);
    }
    return (
      sum +
      (additive?.discountPrice
        ? toFloat(additive.discountPrice)
        : additive?.price
        ? toFloat(additive.price)
        : 0)
    );
  }, 0);

  const totalBase = sizeBasePrice + additivesBaseTotal;
  const totalDiscount =
    sizeDiscountPrice !== null
      ? sizeDiscountPrice + additivesDiscountTotal
      : totalBase;

  return {
    base: totalBase,
    discount: totalDiscount,
    showDiscount: shouldApplyDiscount && totalDiscount < totalBase,
  };
};
