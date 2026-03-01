/**
 * Serviços Supabase
 * Funções para interagir com o banco de dados
 */

import { supabase } from './supabase';
import type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  Store,
  StoreInsert,
  StoreUpdate,
  Product,
  ProductInsert,
  Order,
  OrderInsert,
  OrderUpdate,
  LoyaltyProgram,
  Coupon,
} from './database.types';

// ==================== PROFILES ====================

export const profilesService = {
  // Criar perfil
  async create(data: ProfileInsert) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  // Buscar perfil por ID
  async getById(id: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return profile;
  },

  // Buscar perfil por email
  async getByEmail(email: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return profile;
  },

  // Atualizar perfil
  async update(id: string, data: ProfileUpdate) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  // Listar todos os perfis (admin)
  async getAll() {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return profiles;
  },

  // Buscar por role
  async getByRole(role: Profile['role']) {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return profiles;
  },
};

// ==================== STORES ====================

export const storesService = {
  // Criar loja
  async create(data: StoreInsert) {
    const { data: store, error } = await supabase
      .from('stores')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return store;
  },

  // Buscar loja por ID
  async getById(id: string) {
    const { data: store, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return store;
  },

  // Buscar loja por slug
  async getBySlug(slug: string) {
    const { data: store, error } = await supabase
      .from('stores')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return store;
  },

  // Buscar lojas do usuário
  async getByOwner(ownerId: string) {
    const { data: stores, error } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return stores;
  },

  // Buscar todas as lojas (admin)
  async getAll() {
    const { data: stores, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return stores;
  },

  // Atualizar loja
  async update(id: string, data: StoreUpdate) {
    const { data: store, error } = await supabase
      .from('stores')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return store;
  },

  // Ativar loja
  async activate(id: string) {
    return this.update(id, { is_active: true });
  },

  // Desativar loja
  async deactivate(id: string) {
    return this.update(id, { is_active: false });
  },

  // Excluir loja
  async delete(id: string) {
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },
};

// ==================== PRODUCTS ====================

export const productsService = {
  // Criar produto
  async create(data: ProductInsert) {
    const { data: product, error } = await supabase
      .from('products')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return product;
  },

  // Buscar produtos da loja
  async getByStore(storeId: string, category?: string) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .eq('is_available', true)
      .order('featured', { ascending: false })
      .order('name');

    if (category) {
      query = query.eq('category', category);
    }

    const { data: products, error } = await query;

    if (error) throw error;
    return products;
  },

  // Buscar produtos em destaque
  async getFeatured(storeId: string, limit: number = 10) {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .eq('featured', true)
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return products;
  },

  // Buscar produto por ID
  async getById(id: string) {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return product;
  },

  // Atualizar produto
  async update(id: string, data: ProductUpdate) {
    const { data: product, error } = await supabase
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return product;
  },

  // Excluir produto
  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },
};

// ==================== ORDERS ====================

export const ordersService = {
  // Criar pedido
  async create(data: OrderInsert) {
    const { data: order, error } = await supabase
      .from('orders')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return order;
  },

  // Buscar pedidos da loja
  async getByStore(storeId: string, status?: string) {
    let query = supabase
      .from('orders')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query;

    if (error) throw error;
    return orders;
  },

  // Buscar pedido por ID
  async getById(id: string) {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return order;
  },

  // Atualizar status do pedido
  async updateStatus(id: string, status: Order['status']) {
    return this.update(id, { status, updated_at: new Date().toISOString() });
  },

  // Atualizar pedido
  async update(id: string, data: OrderUpdate) {
    const { data: order, error } = await supabase
      .from('orders')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return order;
  },
};

// ==================== LOYALTY PROGRAMS ====================

export const loyaltyService = {
  // Criar ou atualizar programa de fidelidade
  async upsert(data: LoyaltyProgram) {
    const { data: program, error } = await supabase
      .from('loyalty_programs')
      .upsert(data)
      .select()
      .single();

    if (error) throw error;
    return program;
  },

  // Buscar programa por cliente e loja
  async getByCustomerAndStore(customerId: string, storeId: string) {
    const { data: program, error } = await supabase
      .from('loyalty_programs')
      .select('*')
      .eq('customer_id', customerId)
      .eq('store_id', storeId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return program;
  },

  // Adicionar pontos
  async addPoints(customerId: string, storeId: string, points: number = 1) {
    const program = await this.getByCustomerAndStore(customerId, storeId);

    if (program) {
      return this.upsert({
        ...program,
        points: program.points + points,
        updated_at: new Date().toISOString(),
      });
    } else {
      return this.upsert({
        customer_id: customerId,
        store_id: storeId,
        points: points,
        max_points: 10,
        reward_description: 'Ganhe 1 açaí grátis!',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as LoyaltyProgram);
    }
  },

  // Resgatar prêmio (resetar pontos)
  async redeemReward(customerId: string, storeId: string) {
    const program = await this.getByCustomerAndStore(customerId, storeId);

    if (!program || program.points < program.max_points) {
      throw new Error('Pontos insuficientes');
    }

    return this.upsert({
      ...program,
      points: 0,
      updated_at: new Date().toISOString(),
    });
  },
};

// ==================== COUPONS ====================

export const couponsService = {
  // Criar cupom
  async create(data: CouponInsert) {
    const { data: coupon, error } = await supabase
      .from('coupons')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return coupon;
  },

  // Buscar cupom por código
  async getByCode(code: string) {
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) throw error;
    return coupon;
  },

  // Usar cupom
  async use(code: string) {
    const { data: coupon, error } = await supabase
      .from('coupons')
      .update({ is_used: true })
      .eq('code', code)
      .select()
      .single();

    if (error) throw error;
    return coupon;
  },

  // Buscar cupons do cliente
  async getByCustomer(customerId: string) {
    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return coupons;
  },
};

// ==================== CATEGORIES ====================
export const categoriesService = {
  async create(data: { name: string; store_id: string }) {
    const { data: category, error } = await supabase
      .from('categories')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return category;
  },

  async getByStore(storeId: string) {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('store_id', storeId)
      .order('name');

    if (error) throw error;
    return categories;
  },

  async update(id: string, data: { name?: string }) {
    const { data: category, error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return category;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },
};

// ==================== ADDONS ====================
export const addonsService = {
  async create(data: { name: string; store_id: string; price?: number }) {
    const { data: addon, error } = await supabase
      .from('addons')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return addon;
  },

  async getByStore(storeId: string) {
    const { data: addons, error } = await supabase
      .from('addons')
      .select('*')
      .eq('store_id', storeId)
      .order('name');

    if (error) throw error;
    return addons;
  },

  async update(id: string, data: { name?: string; price?: number }) {
    const { data: addon, error } = await supabase
      .from('addons')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return addon;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('addons')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },
};

export default {
  profiles: profilesService,
  stores: storesService,
  products: productsService,
  orders: ordersService,
  categories: categoriesService,
  addons: addonsService,
  loyalty: loyaltyService,
  coupons: couponsService,
};
