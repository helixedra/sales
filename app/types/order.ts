import { Item } from './item';

export interface Order {
  id: number;
  date: string;
  status: string;
  number: number;
  client: string;
  email: string;
  phone: string;
  address: string;
  delivery: string;
  deadline: number;
  prepayment: number;
  comment: string;
  items: Item[];
}
