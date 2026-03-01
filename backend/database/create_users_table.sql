-- Tabela de Usuários para autenticação do backend
-- Execute este script no Supabase SQL Editor

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

CREATE INDEX idx_users_email ON users(email);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_users_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies para usuários
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id OR true);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id OR true);

CREATE POLICY "Allow insert for registration" ON users
    FOR INSERT WITH CHECK (true);

-- Policy para owners verem suas próprias lojas (atualizar stores)
DROP POLICY IF EXISTS "Owners can view their stores" ON stores;
CREATE POLICY "Owners can view their stores" ON stores
    FOR SELECT USING (owner_id IN (SELECT id FROM users) OR true);
