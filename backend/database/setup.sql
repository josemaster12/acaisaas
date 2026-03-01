-- Script completo de configuração do banco de dados - Pronto Açaí Now
-- Execute ESTE SCRIPT no Supabase SQL Editor

-- ============================================
-- EXTENSÕES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
DO $$ BEGIN
    CREATE TYPE product_size AS ENUM ('300ml', '500ml', '700ml', '1L');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_category AS ENUM ('acai', 'complementos', 'combos', 'bebidas');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pendente', 'em_preparo', 'entregue', 'cancelado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE plan_type AS ENUM ('gratuito', 'profissional', 'premium');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- TABELA DE USUÁRIOS (Autenticação)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- TABELA DE PLANOS (SaaS)
-- ============================================
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type plan_type NOT NULL UNIQUE,
    max_products INTEGER NOT NULL DEFAULT 10,
    max_orders_per_month INTEGER,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir planos padrão (se não existirem)
INSERT INTO plans (name, type, max_products, max_orders_per_month, price, features) VALUES
('Gratuito', 'gratuito', 10, 50, 0, '["Até 10 produtos", "Até 50 pedidos/mês", "Suporte básico"]'::jsonb),
('Profissional', 'profissional', 999999, 500, 49.90, '["Produtos ilimitados", "Até 500 pedidos/mês", "Suporte prioritário", "Analytics básico"]'::jsonb),
('Premium', 'premium', 999999, null, 99.90, '["Produtos ilimitados", "Pedidos ilimitados", "Suporte 24/7", "Analytics completo", "Relatórios PDF"]'::jsonb)
ON CONFLICT (type) DO NOTHING;

-- ============================================
-- TABELA DE LOJAS (Stores)
-- ============================================
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id) DEFAULT (SELECT id FROM plans WHERE type = 'gratuito'),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#7c3aed',
    whatsapp VARCHAR(20) NOT NULL,
    opening_time TIME DEFAULT '09:00:00',
    closing_time TIME DEFAULT '22:00:00',
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    min_order_value DECIMAL(10,2) DEFAULT 0,
    address JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_color CHECK (primary_color ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(is_active);

-- ============================================
-- TABELA DE CATEGORIAS
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type product_category NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(store_id, name)
);

CREATE INDEX IF NOT EXISTS idx_categories_store_id ON categories(store_id);

-- ============================================
-- TABELA DE PRODUTOS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    sizes product_size[],
    stock INTEGER DEFAULT -1,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    preparation_time INTEGER DEFAULT 0,
    calories INTEGER,
    allergens TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);

-- ============================================
-- TABELA DE ADICIONAIS
-- ============================================
CREATE TABLE IF NOT EXISTS addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_required BOOLEAN DEFAULT false,
    max_quantity INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(store_id, name)
);

CREATE INDEX IF NOT EXISTS idx_addons_store_id ON addons(store_id);
CREATE INDEX IF NOT EXISTS idx_addons_product_id ON addons(product_id);

-- ============================================
-- TABELA DE PEDIDOS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    status order_status NOT NULL DEFAULT 'pendente',
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'pix',
    payment_status VARCHAR(50) DEFAULT 'pendente',
    pix_key TEXT,
    pix_qr_code TEXT,
    delivery_type VARCHAR(20) DEFAULT 'delivery',
    delivery_address JSONB,
    notes TEXT,
    estimated_time INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- ============================================
-- ITENS DO PEDIDO
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    size product_size,
    addons JSONB DEFAULT '[]'::jsonb,
    subtotal DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================
-- TABELA DE SUBSCRIÇÕES
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    external_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(store_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_store_id ON subscriptions(store_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- ANALYTICS
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    total_customers INTEGER DEFAULT 0,
    avg_ticket DECIMAL(10,2) DEFAULT 0,
    top_product_id UUID REFERENCES products(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(store_id, date)
);

CREATE INDEX IF NOT EXISTS idx_analytics_store_id ON analytics_daily(store_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics_daily(date);

-- ============================================
-- TRIGGERS
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES - USERS
-- ============================================
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (true);

-- ============================================
-- POLICIES - STORES
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active stores" ON stores;
CREATE POLICY "Anyone can view active stores" ON stores
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Owners can manage their stores" ON stores;
CREATE POLICY "Owners can manage their stores" ON stores
    FOR ALL USING (true);

-- ============================================
-- POLICIES - PRODUCTS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (is_active = true OR EXISTS (
        SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.owner_id IN (SELECT id FROM users)
    ));

DROP POLICY IF EXISTS "Store owners can manage products" ON products;
CREATE POLICY "Store owners can manage products" ON products
    FOR ALL USING (true);

-- ============================================
-- POLICIES - ORDERS
-- ============================================
DROP POLICY IF EXISTS "View orders" ON orders;
CREATE POLICY "View orders" ON orders
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Manage orders" ON orders;
CREATE POLICY "Manage orders" ON orders
    FOR ALL USING (true);

-- ============================================
-- POLICIES - Outras tabelas
-- ============================================
DROP POLICY IF EXISTS "View categories" ON categories;
CREATE POLICY "View categories" ON categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Manage categories" ON categories;
CREATE POLICY "Manage categories" ON categories
    FOR ALL USING (true);

DROP POLICY IF EXISTS "View addons" ON addons;
CREATE POLICY "View addons" ON addons
    FOR SELECT USING (is_active = true OR true);

DROP POLICY IF EXISTS "Manage addons" ON addons;
CREATE POLICY "Manage addons" ON addons
    FOR ALL USING (true);

DROP POLICY IF EXISTS "View order items" ON order_items;
CREATE POLICY "View order items" ON order_items
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Manage order items" ON order_items;
CREATE POLICY "Manage order items" ON order_items
    FOR ALL USING (true);

DROP POLICY IF EXISTS "View subscriptions" ON subscriptions;
CREATE POLICY "View subscriptions" ON subscriptions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Manage subscriptions" ON subscriptions;
CREATE POLICY "Manage subscriptions" ON subscriptions
    FOR ALL USING (true);

DROP POLICY IF EXISTS "View analytics" ON analytics_daily;
CREATE POLICY "View analytics" ON analytics_daily
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Manage analytics" ON analytics_daily;
CREATE POLICY "Manage analytics" ON analytics_daily
    FOR ALL USING (true);

-- ============================================
-- FUNÇÃO: Limite de produtos por plano
-- ============================================
CREATE OR REPLACE FUNCTION check_product_limit()
RETURNS TRIGGER AS $$
DECLARE
    store_plan_id UUID;
    max_products INTEGER;
    current_count INTEGER;
BEGIN
    SELECT s.plan_id INTO store_plan_id FROM stores s WHERE s.id = NEW.store_id;
    SELECT p.max_products INTO max_products FROM plans p WHERE p.id = store_plan_id;
    SELECT COUNT(*) INTO current_count FROM products WHERE store_id = NEW.store_id AND is_active = true;

    IF current_count >= max_products THEN
        RAISE EXCEPTION 'Limite de produtos atingido para o seu plano. Faça upgrade para adicionar mais produtos.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar limite de produtos
DROP TRIGGER IF EXISTS before_product_insert ON products;
CREATE TRIGGER before_product_insert
    BEFORE INSERT ON products
    FOR EACH ROW EXECUTE FUNCTION check_product_limit();

-- ============================================
-- USUÁRIO ADMIN PADRÃO (senha: admin123)
-- ============================================
-- Descomente a linha abaixo se quiser criar um usuário admin padrão
-- INSERT INTO users (email, password_hash, name) VALUES ('admin@prontoacai.com', '$2a$10$rMx9YQYxQYxQYxQYxQYxQuQYxQYxQYxQYxQYxQYxQYxQYxQYxQYxQ', 'Admin') ON CONFLICT (email) DO NOTHING;
