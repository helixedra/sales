import { Order } from '@/app/types/order';
import { moneyFormat } from './format';

type OrderTotal = { number: number; currencyString: string };

// Calculate total by adding up all items from the order
export const orderTotal = (order: Order): OrderTotal => {
  const number = order.items.reduce((acc, item) => acc + Number(item.total), 0);
  return { number, currencyString: moneyFormat(number) };
};
// Calculate the amount left to pay by subtracting the prepay from the total
export const orderLeft = (order: Order): OrderTotal => {
  const total = orderTotal(order).number;
  const number = total - order.prepayment;
  return { number, currencyString: moneyFormat(number) };
};
