import { Item } from "./item";

export interface Order {
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
  items: Item[];
}
