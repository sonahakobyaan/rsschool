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

  const finalSizePrice = sizeDiscountPrice ?? sizeBasePrice;

  const additivesTotal = selectedAdditives.reduce((sum, name) => {
    const additive = detailedProduct.additives?.find((a) => a.name === name);
    if (!additive) return sum;

    const regularPrice = additive.price ? toFloat(additive.price) : 0;

    if (shouldApplyDiscount && additive.discountPrice) {
      return sum + toFloat(additive.discountPrice);
    }

    return sum + regularPrice;
  }, 0);

  const totalBase = sizeBasePrice + additivesTotal;
  const totalWithPossibleDiscount = finalSizePrice + additivesTotal;

  const showDiscount =
    shouldApplyDiscount && totalWithPossibleDiscount < totalBase;

  return {
    base: totalBase,
    discount: showDiscount ? totalWithPossibleDiscount : totalBase,
    showDiscount,
  };
};
