-- Script de criação do banco de dados para o Pronto Açaí Now SaaS
-- Execute este script no Supabase SQL Editor

-- ============================================
-- EXTENSÕES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE product_size AS ENUM ('300ml', '500ml', '700ml', '1L');
CREATE TYPE product_category AS ENUM ('acai', 'complementos', 'combos', 'bebidas');
CREATE TYPE order_status AS ENUM ('pendente', 'em_preparo', 'entregue', 'cancelado');
CREATE TYPE plan_type AS ENUM ('gratuito', 'profissional', 'premium');

-- ============================================
-- TABELA DE PLANOS (SaaS)
-- ============================================
CREATE TABLE plans (
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

-- Inserir planos padrão
INSERT INTO plans (name, type, max_products, max_orders_per_month, price, features) VALUES
('Gratuito', 'gratuito', 10, 50, 0, '["Até 10 produtos", "Até 50 pedidos/mês", "Suporte básico"]'::jsonb),
('Profissional', 'profissional', 999999, 500, 49.90, '["Produtos ilimitados", "Até 500 pedidos/mês", "Suporte prioritário", "Analytics básico"]'::jsonb),
('Premium', 'premium', 999999, null, 99.90, '["Produtos ilimitados", "Pedidos ilimitados", "Suporte 24/7", "Analytics completo", "Relatórios PDF"]'::jsonb);

-- ============================================
-- TABELA DE LOJAS (Stores)
-- ============================================
CREATE TABLE stores (
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

CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_stores_active ON stores(is_active);

-- ============================================
-- TABELA DE CATEGORIAS
-- ============================================
CREATE TABLE categories (
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

CREATE INDEX idx_categories_store_id ON categories(store_id);

-- ============================================
-- TABELA DE PRODUTOS
-- ============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    sizes product_size[],
    stock INTEGER DEFAULT -1, -- -1 = ilimitado
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    preparation_time INTEGER DEFAULT 0, -- em minutos
    calories INTEGER,
    allergens TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);

-- ============================================
-- TABELA DE ADICIONAIS/OPCIONAIS
-- ============================================
CREATE TABLE addons (
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

CREATE INDEX idx_addons_store_id ON addons(store_id);
CREATE INDEX idx_addons_product_id ON addons(product_id);

-- ============================================
-- TABELA DE PEDIDOS
-- ============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES auth.users(id),
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
    delivery_type VARCHAR(20) DEFAULT 'delivery', -- delivery ou pickup
    delivery_address JSONB,
    notes TEXT,
    estimated_time INTEGER, -- em minutos
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ============================================
-- ITENS DO PEDIDO
-- ============================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL, -- Snapshot do nome
    product_price DECIMAL(10,2) NOT NULL, -- Snapshot do preço
    quantity INTEGER NOT NULL DEFAULT 1,
    size product_size,
    addons JSONB DEFAULT '[]'::jsonb, -- [{name, price, quantity}]
    subtotal DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================
-- TABELA DE SUBSCRIÇÕES (SaaS)
-- ============================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, cancelled, expired
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    external_subscription_id VARCHAR(255), -- ID do Stripe/Mercado Pago
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(store_id)
);

CREATE INDEX idx_subscriptions_store_id ON subscriptions(store_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- TABELA DE ANALYTICS (para Premium)
-- ============================================
CREATE TABLE analytics_daily (
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

CREATE INDEX idx_analytics_store_id ON analytics_daily(store_id);
CREATE INDEX idx_analytics_date ON analytics_daily(date);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES - STORES
-- ============================================

-- Dono pode ver/editar/excluir sua própria loja
CREATE POLICY "Owners can view their stores" ON stores
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Owners can update their stores" ON stores
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their stores" ON stores
    FOR DELETE USING (auth.uid() = owner_id);

-- Qualquer um pode ver lojas ativas (página pública)
CREATE POLICY "Anyone can view active stores" ON stores
    FOR SELECT USING (is_active = true);

-- ============================================
-- POLICIES - CATEGORIES
-- ============================================

CREATE POLICY "Store owners can view their categories" ON categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = categories.store_id 
            AND stores.owner_id = auth.uid()
        )
        OR store_id IN (SELECT id FROM stores WHERE is_active = true)
    );

CREATE POLICY "Store owners can manage their categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = categories.store_id 
            AND stores.owner_id = auth.uid()
        )
    );

-- ============================================
-- POLICIES - PRODUCTS
-- ============================================

CREATE POLICY "Store owners can view their products" ON products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = products.store_id 
            AND (stores.owner_id = auth.uid() OR stores.is_active = true)
        )
    );

CREATE POLICY "Store owners can manage their products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = products.store_id 
            AND stores.owner_id = auth.uid()
        )
    );

-- ============================================
-- POLICIES - ADDONS
-- ============================================

CREATE POLICY "Store owners can view their addons" ON addons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = addons.store_id 
            AND (stores.owner_id = auth.uid() OR stores.is_active = true)
        )
    );

CREATE POLICY "Store owners can manage their addons" ON addons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = addons.store_id 
            AND stores.owner_id = auth.uid()
        )
    );

-- ============================================
-- POLICIES - ORDERS
-- ============================================

CREATE POLICY "Store owners can view their orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = orders.store_id 
            AND stores.owner_id = auth.uid()
        )
        OR customer_id = auth.uid()
    );

CREATE POLICY "Store owners can update their orders" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = orders.store_id 
            AND stores.owner_id = auth.uid()
        )
    );

CREATE POLICY "Customers can create orders" ON orders
    FOR INSERT WITH CHECK (customer_id = auth.uid() OR customer_id IS NULL);

-- ============================================
-- POLICIES - ORDER ITEMS
-- ============================================

CREATE POLICY "View order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            JOIN stores ON stores.id = orders.store_id
            WHERE orders.id = order_items.order_id 
            AND (stores.owner_id = auth.uid() OR orders.customer_id = auth.uid() OR stores.is_active = true)
        )
    );

CREATE POLICY "Insert order items" ON order_items
    FOR INSERT WITH CHECK (true);

-- ============================================
-- POLICIES - SUBSCRIPTIONS
-- ============================================

CREATE POLICY "Store owners can view their subscriptions" ON subscriptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = subscriptions.store_id 
            AND stores.owner_id = auth.uid()
        )
    );

-- ============================================
-- POLICIES - ANALYTICS
-- ============================================

CREATE POLICY "Store owners can view their analytics" ON analytics_daily
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores 
            WHERE stores.id = analytics_daily.store_id 
            AND stores.owner_id = auth.uid()
        )
    );

-- ============================================
-- TRIGGERS E FUNÇÕES
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em tabelas com updated_at
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para verificar limite de produtos por plano
CREATE OR REPLACE FUNCTION check_product_limit()
RETURNS TRIGGER AS $$
DECLARE
    store_plan_id UUID;
    max_products INTEGER;
    current_count INTEGER;
BEGIN
    -- Pegar o plano da loja
    SELECT s.plan_id INTO store_plan_id FROM stores s WHERE s.id = NEW.store_id;
    
    -- Pegar limite de produtos do plano
    SELECT p.max_products INTO max_products FROM plans p WHERE p.id = store_plan_id;
    
    -- Contar produtos atuais
    SELECT COUNT(*) INTO current_count FROM products WHERE store_id = NEW.store_id AND is_active = true;
    
    -- Verificar limite
    IF current_count >= max_products THEN
        RAISE EXCEPTION 'Limite de produtos atingido para o seu plano. Faça upgrade para adicionar mais produtos.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar limite de produtos
CREATE TRIGGER before_product_insert
    BEFORE INSERT ON products
    FOR EACH ROW EXECUTE FUNCTION check_product_limit();

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Inserir categoria padrão para exemplo
-- (Categorias específicas serão criadas por cada loja)
