import { Order } from "./order";

export interface Sale {
  id: number;
  date: string;
  status: string;
  number: number;
  client: string;
  email: string;
  tel: string;
  address: string;
  delivery: string;
  deadline: number;
  prepay: number;
  comment: string;
  orders: Order[];
}
