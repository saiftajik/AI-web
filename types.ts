
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'cashier';
}

export interface Product {
  id:string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrls: string[];
  lowStockThreshold: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  createdAt: Date;
}