-- =====================================================
-- SCRIPT SQL PARA CONFIGURAÇÃO DO BANCO DE DADOS
-- Projeto: acaisaas
-- Supabase: https://fwtvjjejycorwukqzwjc.supabase.co
-- =====================================================

-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELAS
-- =====================================================

-- Tabela de Perfis de Usuário
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'owner', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Lojas
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#8B5CF6',
  whatsapp TEXT NOT NULL,
  address JSONB,
  open_hour TEXT NOT NULL DEFAULT '09:00',
  close_hour TEXT NOT NULL DEFAULT '22:00',
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  estimated_time TEXT NOT NULL DEFAULT '30-45 min',
  free_toppings_limit INTEGER NOT NULL DEFAULT 3,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  loyalty_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  loyalty_points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'tradicional' CHECK (category IN ('tradicional', 'frutas', 'especiais', 'combos')),
  sizes JSONB NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('dinheiro', 'pix', 'cartao')),
  change_for DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_preparo', 'saiu_para_entrega', 'entregue', 'cancelado')),
  estimated_time TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Programa de Fidelidade
CREATE TABLE IF NOT EXISTS loyalty_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  max_points INTEGER NOT NULL DEFAULT 10,
  reward_description TEXT NOT NULL DEFAULT 'Ganhe 1 açaí grátis!',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, store_id)
);

-- Tabela de Cupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  discount_percentage INTEGER NOT NULL DEFAULT 100,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(is_active);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_loyalty_customer_id ON loyalty_programs(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_store_id ON loyalty_programs(store_id);
CREATE INDEX IF NOT EXISTS idx_coupons_customer_id ON coupons(customer_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_programs_updated_at
  BEFORE UPDATE ON loyalty_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES - PROFILES
-- =====================================================

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admin pode ver todos os perfis
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- POLICIES - STORES
-- =====================================================

-- Qualquer um pode ver lojas ativas
CREATE POLICY "Anyone can view active stores"
  ON stores FOR SELECT
  USING (is_active = TRUE);

-- Admin pode ver todas as lojas
CREATE POLICY "Admins can view all stores"
  ON stores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Dono pode criar loja
CREATE POLICY "Owners can create stores"
  ON stores FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Dono pode atualizar sua loja
CREATE POLICY "Owners can update own stores"
  ON stores FOR UPDATE
  USING (auth.uid() = owner_id);

-- Admin pode atualizar qualquer loja
CREATE POLICY "Admins can update any store"
  ON stores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin pode excluir qualquer loja
CREATE POLICY "Admins can delete any store"
  ON stores FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- POLICIES - PRODUCTS
-- =====================================================

-- Qualquer um pode ver produtos de lojas ativas
CREATE POLICY "Anyone can view products from active stores"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = products.store_id AND stores.is_active = TRUE
    )
  );

-- Dono da loja pode gerenciar produtos
CREATE POLICY "Store owners can manage products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = products.store_id AND stores.owner_id = auth.uid()
    )
  );

-- =====================================================
-- POLICIES - ORDERS
-- =====================================================

-- Cliente pode ver seus próprios pedidos
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (customer_id = auth.uid());

-- Dono da loja pode ver pedidos da loja
CREATE POLICY "Store owners can view store orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid()
    )
  );

-- Cliente pode criar pedido
CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id OR customer_id IS NULL);

-- Dono da loja pode atualizar pedidos da loja
CREATE POLICY "Store owners can update store orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid()
    )
  );

-- =====================================================
-- POLICIES - LOYALTY PROGRAMS
-- =====================================================

-- Cliente pode ver seu programa de fidelidade
CREATE POLICY "Customers can view own loyalty"
  ON loyalty_programs FOR SELECT
  USING (customer_id = auth.uid());

-- Sistema pode inserir/atualizar fidelidade
CREATE POLICY "System can manage loyalty"
  ON loyalty_programs FOR ALL
  USING (TRUE);

-- =====================================================
-- POLICIES - COUPONS
-- =====================================================

-- Cliente pode ver seus cupons
CREATE POLICY "Customers can view own coupons"
  ON coupons FOR SELECT
  USING (customer_id = auth.uid());

-- Sistema pode gerenciar cupons
CREATE POLICY "System can manage coupons"
  ON coupons FOR ALL
  USING (TRUE);

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir admin padrão (a senha deve ser definida via auth.users)
-- Este script apenas prepara as tabelas
-- O usuário admin deve ser criado via interface do Supabase Auth

-- =====================================================
-- FUNÇÕES
-- =====================================================

-- Função para criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE profiles IS 'Perfis de usuários do sistema';
COMMENT ON TABLE stores IS 'Lojas de açaí cadastradas';
COMMENT ON TABLE products IS 'Produtos das lojas';
COMMENT ON TABLE orders IS 'Pedidos dos clientes';
COMMENT ON TABLE loyalty_programs IS 'Programa de fidelidade dos clientes';
COMMENT ON TABLE coupons IS 'Cupons de desconto';

COMMENT ON COLUMN profiles.role IS 'customer: cliente, owner: dono de loja, admin: administrador';
COMMENT ON COLUMN stores.loyalty_enabled IS 'Se true, loja tem programa de fidelidade ativo';
COMMENT ON COLUMN stores.loyalty_points IS 'Pontos necessários para resgatar prêmio';
COMMENT ON COLUMN orders.status IS 'Status do pedido: pendente, em_preparo, saiu_para_entrega, entregue, cancelado';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
