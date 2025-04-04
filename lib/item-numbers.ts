import { Item } from "@/app/types/Item";
import { moneyFormatDigital } from "./format";

export function discountNumbers(item: Item) {
  const discountedPrice =
    Number(item.price) - Number(item.price) * Number(item.discount);
  const discountPercentage = Number(item.discount) * 100;
  const discountAmount =
    (Number(item.price) - discountedPrice) * Number(item.quantity);
  return {
    discountedPrice,
    discountPercentage,
    discountAmount,
    discountedPriceFormatted: moneyFormatDigital(discountedPrice),
    discountAmountFormatted: moneyFormatDigital(discountAmount),
  };
}

export function itemNumbers(item: Item) {
  const discount = discountNumbers(item);
  const totalWithDiscount = discount.discountedPrice * Number(item.quantity);
  const totalWithDiscountFormatted = moneyFormatDigital(totalWithDiscount);
  const totalDiscount = discount.discountAmount;
  const totalDiscountFormatted = moneyFormatDigital(totalDiscount);
  const total = Number(item.price) * Number(item.quantity);
  const totalFormatted = moneyFormatDigital(total);
  return {
    total,
    totalFormatted,
    totalWithDiscount,
    totalWithDiscountFormatted,
    totalDiscount,
    totalDiscountFormatted,
  };
}
