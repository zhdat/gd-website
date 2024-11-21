export interface Product {
  id: string;
  picture: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export type ProductCategory = 'all' | 'patisseries' | 'viennoiseries' | 'gateaux' | 'macarons';

export interface Order {
  id: string;
  created_at: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  delivery_address: string;
  content: JSON;
  total_price: number;
  status: string;
  date: string;
  time: string;
  notes: string;
}