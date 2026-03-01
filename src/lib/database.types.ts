/**
 * Tipos do Banco de Dados Supabase
 * Projeto: acaisaas
 * 
 * Estes tipos são gerados automaticamente pelo Supabase CLI
 * Para atualizar: npx supabase gen types typescript --project-id fwtvjjejycorwukqzwjc
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Tabela de Perfis de Usuário
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          role: 'customer' | 'owner' | 'admin';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          phone?: string | null;
          role?: 'customer' | 'owner' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          role?: 'customer' | 'owner' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Tabela de Lojas
      stores: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          primary_color: string;
          whatsapp: string;
          address: Json | null;
          open_hour: string;
          close_hour: string;
          delivery_fee: number;
          min_order_value: number;
          estimated_time: string;
          free_toppings_limit: number;
          is_active: boolean;
          loyalty_enabled: boolean;
          loyalty_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          primary_color?: string;
          whatsapp: string;
          address?: Json | null;
          open_hour?: string;
          close_hour?: string;
          delivery_fee?: number;
          min_order_value?: number;
          estimated_time?: string;
          free_toppings_limit?: number;
          is_active?: boolean;
          loyalty_enabled?: boolean;
          loyalty_points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          primary_color?: string;
          whatsapp?: string;
          address?: Json | null;
          open_hour?: string;
          close_hour?: string;
          delivery_fee?: number;
          min_order_value?: number;
          estimated_time?: string;
          free_toppings_limit?: number;
          is_active?: boolean;
          loyalty_enabled?: boolean;
          loyalty_points?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Tabela de Produtos
      products: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          description: string;
          image_url: string | null;
          category: 'tradicional' | 'frutas' | 'especiais' | 'combos';
          sizes: Json;
          featured: boolean;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          name: string;
          description: string;
          image_url?: string | null;
          category?: 'tradicional' | 'frutas' | 'especiais' | 'combos';
          sizes: Json;
          featured?: boolean;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          name?: string;
          description?: string;
          image_url?: string | null;
          category?: 'tradicional' | 'frutas' | 'especiais' | 'combos';
          sizes?: Json;
          featured?: boolean;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Tabela de Pedidos
      orders: {
        Row: {
          id: string;
          store_id: string;
          customer_id: string | null;
          customer_name: string;
          customer_phone: string;
          customer_address: Json;
          items: Json;
          subtotal: number;
          delivery_fee: number;
          discount: number;
          total: number;
          payment_method: 'dinheiro' | 'pix' | 'cartao';
          change_for: number | null;
          status: 'pendente' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado';
          estimated_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          customer_id?: string | null;
          customer_name: string;
          customer_phone: string;
          customer_address: Json;
          items: Json;
          subtotal: number;
          delivery_fee: number;
          discount?: number;
          total: number;
          payment_method: 'dinheiro' | 'pix' | 'cartao';
          change_for?: number | null;
          status?: 'pendente' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado';
          estimated_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          customer_address?: Json;
          items?: Json;
          subtotal?: number;
          delivery_fee?: number;
          discount?: number;
          total?: number;
          payment_method?: 'dinheiro' | 'pix' | 'cartao';
          change_for?: number | null;
          status?: 'pendente' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado';
          estimated_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Tabela de Programa de Fidelidade
      loyalty_programs: {
        Row: {
          id: string;
          customer_id: string;
          store_id: string;
          points: number;
          max_points: number;
          reward_description: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          store_id: string;
          points?: number;
          max_points?: number;
          reward_description?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          store_id?: string;
          points?: number;
          max_points?: number;
          reward_description?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Tabela de Cupons
      coupons: {
        Row: {
          id: string;
          customer_id: string;
          code: string;
          discount_percentage: number;
          is_used: boolean;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          code: string;
          discount_percentage?: number;
          is_used?: boolean;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          code?: string;
          discount_percentage?: number;
          is_used?: boolean;
          expires_at?: string;
          created_at?: string;
        };
      };
    };

    Views: {
      [_ in never]: never;
    };

    Functions: {
      [_ in never]: never;
    };

    Enums: {
      user_role: 'customer' | 'owner' | 'admin';
      product_category: 'tradicional' | 'frutas' | 'especiais' | 'combos';
      order_status: 'pendente' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado';
      payment_method: 'dinheiro' | 'pix' | 'cartao';
    };
  };
}

// Tipos auxiliares para uso no frontend
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Store = Database['public']['Tables']['stores']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type LoyaltyProgram = Database['public']['Tables']['loyalty_programs']['Row'];
export type Coupon = Database['public']['Tables']['coupons']['Row'];

// Tipos para inserts
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type StoreInsert = Database['public']['Tables']['stores']['Insert'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type LoyaltyProgramInsert = Database['public']['Tables']['loyalty_programs']['Insert'];
export type CouponInsert = Database['public']['Tables']['coupons']['Insert'];

// Tipos para updates
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type StoreUpdate = Database['public']['Tables']['stores']['Update'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];
export type LoyaltyProgramUpdate = Database['public']['Tables']['loyalty_programs']['Update'];
export type CouponUpdate = Database['public']['Tables']['coupons']['Update'];
