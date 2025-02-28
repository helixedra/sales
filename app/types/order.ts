export interface Order {
  order_id: number | null;
  // created: string;
  description: string;
  qty: number | string;
  price: number | string;
  order_sum: number | string;
  order_dis: number | string;
  discount: number | string;
  number: number | string;
}
