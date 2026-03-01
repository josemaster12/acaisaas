export interface ProductSize {
  size: string;
  ml: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'tradicional' | 'frutas' | 'especiais' | 'combos';
  sizes: ProductSize[];
  featured?: boolean;
}

export interface Topping {
  id: string;
  name: string;
  icon: string;
  price: number;
  category: 'free' | 'paid';
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: ProductSize;
  toppings: Topping[];
  quantity: number;
  notes?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  reference: string;
  paymentMethod: 'dinheiro' | 'pix' | 'cartao';
  change?: string;
}

export interface StoreConfig {
  name: string;
  whatsapp: string;
  openHour: number;
  closeHour: number;
  deliveryFee: number;
  minOrder: number;
  estimatedTime: string;
  freeToppingsLimit: number;
}

export type Category = {
  id: string;
  name: string;
  icon: string;
};
