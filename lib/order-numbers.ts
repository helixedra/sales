import { Order } from "@/app/types/Order";
import { moneyFormat, moneyFormatDigital } from "./format";
import account from "@/app/data/account.json";
import { Item } from "@/app/types/Item";

type OrderTotal = {
  number: number;
  currencyString: string;
  numberDigital: string;
};
type orderTotalTaxed = {
  number: number;
  currencyString: string;
  tax: number;
  taxAmount: number;
  taxAmountString: string;
  numberDigital: string;
  taxAmountDigital: string;
};

export const priceDiscount = (item: Item) => {
  const discountInPrice = Number(item.price) * Number(item.discount);
  const priceWithDiscount = Number(item.price) - discountInPrice;
  return {
    discountInPrice,
    priceWithDiscount,
    discountInPriceString: moneyFormat(discountInPrice),
    priceWithDiscountString: moneyFormat(priceWithDiscount),
  };
};

// Calculate total by adding up all items from the order
export const orderTotal = (order: Order): OrderTotal => {
  const number = order.items.reduce(
    (acc, item) =>
      acc + priceDiscount(item).priceWithDiscount * Number(item.quantity),
    0
  );
  return {
    number,
    currencyString: moneyFormat(number),
    numberDigital: moneyFormatDigital(number),
  };
};
// Calculate the amount left to pay by subtracting the prepay from the total
export const orderLeft = (order: Order): OrderTotal => {
  const total = orderTotal(order).number;
  const number = total - order.prepayment;
  return {
    number,
    currencyString: moneyFormat(number),
    numberDigital: moneyFormatDigital(number),
  };
};

export const orderTotalTaxed = (order: Order): orderTotalTaxed => {
  const tax = Number(account.finance.tax);
  const total = orderTotal(order).number;
  const number = total + (total * tax) / 100;
  const taxAmount = (total * tax) / 100;
  return {
    number,
    currencyString: moneyFormat(number),
    tax,
    taxAmount,
    taxAmountString: moneyFormat(taxAmount),
    numberDigital: moneyFormatDigital(number),
    taxAmountDigital: moneyFormatDigital(taxAmount),
  };
};
