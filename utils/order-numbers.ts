import { Sale } from "@/app/types/sale";
import { moneyFormat } from "./format";

type OrderTotal = { number: number; currencyString: string };

// Calculate total by adding up all items from the order
export const orderTotal = (sale: Sale): OrderTotal => {
  const number = sale.orders.reduce((acc, order) => acc + Number(order.order_sum), 0);
  return { number, currencyString: moneyFormat(number) };
};
// Calculate the amount left to pay by subtracting the prepay from the total
export const orderLeft = (sale: Sale): OrderTotal => {
  const total = orderTotal(sale).number;
  const number = total - sale.prepay;
  return { number, currencyString: moneyFormat(number) };
};
