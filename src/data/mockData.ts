/**
 * Dados Mockados para Desenvolvimento do Frontend
 * Estes dados simulam a resposta da API para desenvolvimento sem backend
 */

import { Product, Topping, Category } from '@/types';

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

// ==================== CATEGORIAS ====================
export const mockCategories: Category[] = [
  { id: 'tradicional', name: 'Tradicional', icon: '🍇' },
  { id: 'frutas', name: 'Com Frutas', icon: '🍓' },
  { id: 'especiais', name: 'Especiais', icon: '✨' },
  { id: 'combos', name: 'Combos', icon: '🎉' },
];

// ==================== TOPPINGS ====================
export const mockToppings: Topping[] = [
  { id: 'banana', name: 'Banana', icon: '🍌', price: 0, category: 'free' },
  { id: 'morango', name: 'Morango', icon: '🍓', price: 0, category: 'free' },
  { id: 'granola', name: 'Granola', icon: '🥣', price: 0, category: 'free' },
  { id: 'leite-condensado', name: 'Leite Condensado', icon: '🥛', price: 0, category: 'free' },
  { id: 'leite-po', name: 'Leite em Pó', icon: '☁️', price: 0, category: 'free' },
  { id: 'mel', name: 'Mel', icon: '🍯', price: 0, category: 'free' },
  { id: 'pacoca', name: 'Paçoca', icon: '🥜', price: 2.00, category: 'paid' },
  { id: 'nutella', name: 'Nutella', icon: '🍫', price: 4.00, category: 'paid' },
  { id: 'ovomaltine', name: 'Ovomaltine', icon: '🍪', price: 3.00, category: 'paid' },
  { id: 'amendoim', name: 'Amendoim', icon: '🥜', price: 2.00, category: 'paid' },
  { id: 'chocolate', name: 'Chocolate', icon: '🍫', price: 2.50, category: 'paid' },
  { id: 'coco', name: 'Coco Ralado', icon: '🥥', price: 2.00, category: 'paid' },
];

// ==================== PRODUTOS ====================
export const mockProducts: Product[] = [
  // Tradicional
  {
    id: 'acai-puro',
    name: 'Açaí Puro',
    description: 'Açaí natural batido na hora, cremoso e refrescante',
    image: acaiPuro,
    category: 'tradicional',
    sizes: [
      { size: 'P', ml: 300, price: 12.00 },
      { size: 'M', ml: 500, price: 18.00 },
      { size: 'G', ml: 700, price: 24.00 },
      { size: 'GG', ml: 1000, price: 32.00 },
    ],
    featured: true,
  },
  {
    id: 'acai-tradicional',
    name: 'Açaí Tradicional',
    description: 'Açaí com banana, granola e leite condensado',
    image: acaiTradicional,
    category: 'tradicional',
    sizes: [
      { size: 'P', ml: 300, price: 14.00 },
      { size: 'M', ml: 500, price: 20.00 },
      { size: 'G', ml: 700, price: 26.00 },
      { size: 'GG', ml: 1000, price: 35.00 },
    ],
    featured: true,
  },
  // Com Frutas
  {
    id: 'acai-morango',
    name: 'Açaí com Morango',
    description: 'Açaí cremoso com morangos frescos picados',
    image: acaiMorango,
    category: 'frutas',
    sizes: [
      { size: 'P', ml: 300, price: 15.00 },
      { size: 'M', ml: 500, price: 22.00 },
      { size: 'G', ml: 700, price: 28.00 },
      { size: 'GG', ml: 1000, price: 38.00 },
    ],
    featured: true,
  },
  {
    id: 'acai-mix-frutas',
    name: 'Açaí Mix Frutas',
    description: 'Açaí com banana, morango, kiwi e manga',
    image: acaiMixFrutas,
    category: 'frutas',
    sizes: [
      { size: 'P', ml: 300, price: 17.00 },
      { size: 'M', ml: 500, price: 24.00 },
      { size: 'G', ml: 700, price: 30.00 },
      { size: 'GG', ml: 1000, price: 40.00 },
    ],
  },
  // Especiais
  {
    id: 'acai-nutella',
    name: 'Açaí Nutella',
    description: 'Açaí premium com Nutella generosa e morango',
    image: acaiNutella,
    category: 'especiais',
    sizes: [
      { size: 'P', ml: 300, price: 20.00 },
      { size: 'M', ml: 500, price: 28.00 },
      { size: 'G', ml: 700, price: 35.00 },
      { size: 'GG', ml: 1000, price: 45.00 },
    ],
    featured: true,
  },
  {
    id: 'acai-ninho',
    name: 'Açaí Ninho',
    description: 'Açaí com leite ninho, banana e leite condensado',
    image: acaiNinho,
    category: 'especiais',
    sizes: [
      { size: 'P', ml: 300, price: 18.00 },
      { size: 'M', ml: 500, price: 25.00 },
      { size: 'G', ml: 700, price: 32.00 },
      { size: 'GG', ml: 1000, price: 42.00 },
    ],
  },
  {
    id: 'acai-tropical',
    name: 'Açaí Tropical',
    description: 'Açaí com manga, coco e mel de abelha',
    image: acaiTropical,
    category: 'especiais',
    sizes: [
      { size: 'P', ml: 300, price: 19.00 },
      { size: 'M', ml: 500, price: 26.00 },
      { size: 'G', ml: 700, price: 33.00 },
      { size: 'GG', ml: 1000, price: 43.00 },
    ],
  },
  // Combos
  {
    id: 'combo-casal',
    name: 'Combo Casal',
    description: '2 açaís de 500ml + 4 adicionais à escolha',
    image: comboCasal,
    category: 'combos',
    sizes: [
      { size: 'Combo', ml: 1000, price: 45.00 },
    ],
  },
  {
    id: 'combo-familia',
    name: 'Combo Família',
    description: '4 açaís de 500ml + 8 adicionais à escolha',
    image: comboFamilia,
    category: 'combos',
    sizes: [
      { size: 'Combo', ml: 2000, price: 85.00 },
    ],
  },
];

// ==================== LOJAS ====================
export interface MockStore {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  logo?: string;
  primary_color: string;
  whatsapp: string;
  address: string;
  openHour: number;
  closeHour: number;
  deliveryFee: number;
  minOrder: number;
  estimatedTime: string;
  freeToppingsLimit: number;
  is_active: boolean;
  created_at: string;
}

export const mockStores: MockStore[] = [
  {
    id: 'store-1',
    name: 'Açaí Express',
    slug: 'acai-express',
    owner_id: 'user-1',
    logo: '/src/assets/acai-tradicional.jpg',
    primary_color: '#8B5CF6',
    whatsapp: '5511999999999',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    openHour: 10,
    closeHour: 22,
    deliveryFee: 5.00,
    minOrder: 20.00,
    estimatedTime: '30-45 min',
    freeToppingsLimit: 3,
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'store-2',
    name: 'Açaí & Cia',
    slug: 'acai-e-cia',
    owner_id: 'user-1',
    logo: '/src/assets/acai-morango.jpg',
    primary_color: '#EC4899',
    whatsapp: '5511988888888',
    address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    openHour: 11,
    closeHour: 23,
    deliveryFee: 7.00,
    minOrder: 25.00,
    estimatedTime: '40-50 min',
    freeToppingsLimit: 4,
    is_active: true,
    created_at: '2024-02-20T14:00:00Z',
  },
];

// ==================== USUÁRIOS ====================
export interface MockUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  password?: string; // Em produção nunca armazenar senha pura!
  role?: 'user' | 'admin'; // Admin global pode gerenciar todas lojas
}

export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'admin@prontoacai.com',
    name: 'Administrador',
    phone: '5511999999999',
    password: '123456',
    role: 'user',
  },
  {
    id: 'user-2',
    email: 'lojista@acaiexpress.com',
    name: 'João Silva',
    phone: '5511988888888',
    password: '123456',
    role: 'user',
  },
  {
    id: 'user-admin',
    email: 'josetecnico21@gmail.com',
    name: 'Administrador Global',
    phone: '5511999999999',
    password: 'tenderbr0',
    role: 'admin',
  },
];

// ==================== PEDIDOS ====================
export interface MockOrder {
  id: string;
  store_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_reference?: string;
  items: {
    product_id: string;
    product_name: string;
    size: string;
    price: number;
    quantity: number;
    toppings: { name: string; price: number }[];
    notes?: string;
  }[];
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_method: 'dinheiro' | 'pix' | 'cartao';
  change_for?: number;
  status: 'pendente' | 'em_preparo' | 'saiu_entrega' | 'entregue' | 'cancelado';
  created_at: string;
  estimated_time?: string;
}

export const mockOrders: MockOrder[] = [
  {
    id: 'order-1',
    store_id: 'store-1',
    customer_name: 'Maria Santos',
    customer_phone: '5511977777777',
    customer_address: 'Rua Augusta, 500 - Consolação, São Paulo - SP',
    customer_reference: 'Próximo ao metrô Consolação',
    items: [
      {
        product_id: 'acai-morango',
        product_name: 'Açaí com Morango',
        size: 'M (500ml)',
        price: 22.00,
        quantity: 2,
        toppings: [
          { name: 'Banana', price: 0 },
          { name: 'Granola', price: 0 },
          { name: 'Leite Condensado', price: 0 },
          { name: 'Nutella', price: 4.00 },
        ],
        notes: 'Sem gelo, por favor',
      },
      {
        product_id: 'acai-nutella',
        product_name: 'Açaí Nutella',
        size: 'P (300ml)',
        price: 20.00,
        quantity: 1,
        toppings: [
          { name: 'Morango', price: 0 },
          { name: 'Leite em Pó', price: 0 },
        ],
      },
    ],
    subtotal: 68.00,
    delivery_fee: 5.00,
    discount: 0,
    total: 73.00,
    payment_method: 'pix',
    status: 'em_preparo',
    created_at: '2024-03-15T14:30:00Z',
    estimated_time: '30 min',
  },
  {
    id: 'order-2',
    store_id: 'store-1',
    customer_name: 'Pedro Oliveira',
    customer_phone: '5511966666666',
    customer_address: 'Rua da Consolação, 200 - República, São Paulo - SP',
    items: [
      {
        product_id: 'combo-casal',
        product_name: 'Combo Casal',
        size: 'Combo',
        price: 45.00,
        quantity: 1,
        toppings: [
          { name: 'Banana', price: 0 },
          { name: 'Morango', price: 0 },
          { name: 'Granola', price: 0 },
          { name: 'Leite Condensado', price: 0 },
          { name: 'Ovomaltine', price: 3.00 },
          { name: 'Paçoca', price: 2.00 },
        ],
      },
    ],
    subtotal: 50.00,
    delivery_fee: 5.00,
    discount: 0,
    total: 55.00,
    payment_method: 'dinheiro',
    change_for: 100,
    status: 'pendente',
    created_at: '2024-03-15T15:00:00Z',
    estimated_time: '40 min',
  },
  {
    id: 'order-3',
    store_id: 'store-1',
    customer_name: 'Ana Costa',
    customer_phone: '5511955555555',
    customer_address: 'Av. Ipiranga, 300 - República, São Paulo - SP',
    customer_reference: 'Edifício Azul, apto 52',
    items: [
      {
        product_id: 'acai-tropical',
        product_name: 'Açaí Tropical',
        size: 'G (700ml)',
        price: 33.00,
        quantity: 1,
        toppings: [
          { name: 'Banana', price: 0 },
          { name: 'Coco', price: 2.00 },
          { name: 'Mel', price: 0 },
        ],
      },
    ],
    subtotal: 35.00,
    delivery_fee: 5.00,
    discount: 0,
    total: 40.00,
    payment_method: 'cartao',
    status: 'entregue',
    created_at: '2024-03-15T13:00:00Z',
    estimated_time: '35 min',
  },
];

// ==================== PLANOS ====================
export interface MockPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  max_products: number;
  max_orders: number;
  features: string[];
}

export const mockPlans: MockPlan[] = [
  {
    id: 'plan-free',
    name: 'Gratuito',
    description: 'Perfeito para começar',
    price: 0,
    max_products: 10,
    max_orders: 50,
    features: [
      'Até 10 produtos',
      'Até 50 pedidos/mês',
      'Suporte básico',
      'Cardápio online',
      'Pedidos via WhatsApp',
    ],
  },
  {
    id: 'plan-pro',
    name: 'Profissional',
    description: 'Para lojas em crescimento',
    price: 49.90,
    max_products: -1,
    max_orders: 500,
    features: [
      'Produtos ilimitados',
      'Até 500 pedidos/mês',
      'Suporte prioritário',
      'Analytics básico',
      'Personalização da loja',
      'Taxa de entrega configurável',
    ],
  },
  {
    id: 'plan-premium',
    name: 'Premium',
    description: 'Recursos completos',
    price: 99.90,
    max_products: -1,
    max_orders: -1,
    features: [
      'Produtos ilimitados',
      'Pedidos ilimitados',
      'Suporte 24/7',
      'Analytics completo',
      'Relatórios em PDF',
      'Múltiplas lojas',
      'API de integração',
      'Sem taxa por pedido',
    ],
  },
];

// ==================== DASHBOARD STATS ====================
export interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  completed_orders: number;
  revenue_by_period: { date: string; value: number }[];
  recent_orders: MockOrder[];
}

export const mockDashboardStats: DashboardStats = {
  total_products: 9,
  total_orders: 3,
  total_revenue: 168.00,
  pending_orders: 1,
  completed_orders: 1,
  revenue_by_period: [
    { date: '2024-03-10', value: 120.00 },
    { date: '2024-03-11', value: 180.00 },
    { date: '2024-03-12', value: 95.00 },
    { date: '2024-03-13', value: 210.00 },
    { date: '2024-03-14', value: 155.00 },
    { date: '2024-03-15', value: 168.00 },
  ],
  recent_orders: mockOrders,
};
