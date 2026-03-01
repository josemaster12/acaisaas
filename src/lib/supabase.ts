/**
 * Cliente Supabase
 * Configuração para conexão com o banco de dados
 * Projeto: acaisaas
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase URL ou chave não configuradas!');
  console.error('Verifique as variáveis de ambiente no arquivo .env');
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'X-Client-Info': 'acaisaas-frontend',
      },
    },
  }
);

// Funções auxiliares de autenticação
export const supabaseAuth = {
  // Sign up
  signUp: async (email: string, password: string, metadata?: { name?: string; phone?: string }) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  },

  // Sign in
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  // Get current session
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  // Get current user
  getUser: async () => {
    return await supabase.auth.getUser();
  },

  // Reset password
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/resetar-senha`,
    });
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    return await supabase.auth.updateUser({
      password: newPassword,
    });
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default supabase;
