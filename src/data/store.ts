import { StoreConfig, Category, Topping, Product } from '@/types';
import { mockProducts, mockCategories, mockToppings } from './mockData';

// Import images
import acaiPuro from '@/assets/acai-puro.jpg';
import acaiTradicional from '@/assets/acai-tradicional.jpg';
import acaiMorango from '@/assets/acai-morango.jpg';
import acaiMixFrutas from '@/assets/acai-mix-frutas.jpg';
import acaiNutella from '@/assets/acai-nutella.jpg';
import acaiNinho from '@/assets/acai-ninho.jpg';
import acaiTropical from '@/assets/acai-tropical.jpg';
import comboCasal from '@/assets/combo-casal.jpg';
import comboFamilia from '@/assets/combo-familia.jpg';

export const storeConfig: StoreConfig = {
  name: 'Açaí Express',
  whatsapp: '5511999999999', // Substitua pelo número real
  openHour: 10,
  closeHour: 22,
  deliveryFee: 5.00,
  minOrder: 20.00,
  estimatedTime: '30-45 min',
  freeToppingsLimit: 3,
};

// Usar dados mockados para desenvolvimento
export const categories: Category[] = mockCategories;
export const toppings: Topping[] = mockToppings;
export const products: Product[] = mockProducts;
