/**
 * Configuração do Banco de Dados SQLite para desenvolvimento
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../data/database.sqlite');

// Criar diretório data se não existir
import fs from 'fs';
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

console.log('Banco de dados SQLite:', dbPath);

const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Função para gerar UUID
db.function('UUID', () => randomUUID());

// Criar tabelas
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (UUID()),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT,
        phone TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS plans (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL UNIQUE,
        max_products INTEGER NOT NULL DEFAULT 10,
        max_orders_per_month INTEGER,
        price REAL NOT NULL DEFAULT 0,
        features TEXT DEFAULT '[]',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stores (
        id TEXT PRIMARY KEY,
        owner_id TEXT NOT NULL REFERENCES users(id),
        plan_id TEXT REFERENCES plans(id),
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        logo_url TEXT,
        primary_color TEXT DEFAULT '#7c3aed',
        whatsapp TEXT NOT NULL,
        opening_time TEXT DEFAULT '09:00:00',
        closing_time TEXT DEFAULT '22:00:00',
        delivery_fee REAL DEFAULT 0,
        min_order_value REAL DEFAULT 0,
        address TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL REFERENCES stores(id),
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        display_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(store_id, name)
    );

    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL REFERENCES stores(id),
        category_id TEXT REFERENCES categories(id),
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        sizes TEXT,
        stock INTEGER DEFAULT -1,
        is_active INTEGER DEFAULT 1,
        is_featured INTEGER DEFAULT 0,
        preparation_time INTEGER DEFAULT 0,
        calories INTEGER,
        allergens TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS addons (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL REFERENCES stores(id),
        product_id TEXT REFERENCES products(id),
        name TEXT NOT NULL,
        price REAL NOT NULL,
        is_required INTEGER DEFAULT 0,
        max_quantity INTEGER DEFAULT 1,
        display_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(store_id, name)
    );

    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL REFERENCES stores(id),
        customer_id TEXT REFERENCES users(id),
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        status TEXT NOT NULL DEFAULT 'pendente',
        subtotal REAL NOT NULL,
        delivery_fee REAL DEFAULT 0,
        discount REAL DEFAULT 0,
        total REAL NOT NULL,
        payment_method TEXT DEFAULT 'pix',
        payment_status TEXT DEFAULT 'pendente',
        pix_key TEXT,
        pix_qr_code TEXT,
        delivery_type TEXT DEFAULT 'delivery',
        delivery_address TEXT,
        notes TEXT,
        estimated_time INTEGER,
        completed_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL REFERENCES orders(id),
        product_id TEXT NOT NULL REFERENCES products(id),
        product_name TEXT NOT NULL,
        product_price REAL NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        size TEXT,
        addons TEXT DEFAULT '[]',
        subtotal REAL NOT NULL,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL REFERENCES stores(id),
        plan_id TEXT NOT NULL REFERENCES plans(id),
        status TEXT NOT NULL DEFAULT 'active',
        current_period_start TEXT DEFAULT CURRENT_TIMESTAMP,
        current_period_end TEXT,
        cancel_at_period_end INTEGER DEFAULT 0,
        cancelled_at TEXT,
        payment_method TEXT,
        external_subscription_id TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(store_id)
    );

    -- Inserir planos padrão
    INSERT OR IGNORE INTO plans (id, name, type, max_products, max_orders_per_month, price, features) 
    VALUES 
        ('plan-free', 'Gratuito', 'gratuito', 10, 50, 0, '["Até 10 produtos", "Até 50 pedidos/mês", "Suporte básico"]'),
        ('plan-pro', 'Profissional', 'profissional', 999999, 500, 49.90, '["Produtos ilimitados", "Até 500 pedidos/mês", "Suporte prioritário", "Analytics básico"]'),
        ('plan-premium', 'Premium', 'premium', 999999, null, 99.90, '["Produtos ilimitados", "Pedidos ilimitados", "Suporte 24/7", "Analytics completo", "Relatórios PDF"]')
    ;

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);
    CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);
    CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
    CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);
`);

console.log('✅ Banco de dados SQLite inicializado');

// Helper para converter resultados para objetos
function toObject(row) {
    if (!row) return null;
    return { ...row };
}

// Helper para arrays
function toArrayOfObjects(rows) {
    return rows.map(row => ({ ...row }));
}

// Query helper compatível com o código existente
export const query = (text, params = []) => {
    const start = Date.now();
    
    // Converter parâmetros do formato PostgreSQL para SQLite
    const sqliteText = text.replace(/\$[0-9]+/g, '?');
    
    try {
        let result;
        const upperText = text.trim().toUpperCase();
        
        if (upperText.startsWith('SELECT')) {
            const rows = db.prepare(sqliteText).all(...(params || []));
            result = { rows: toArrayOfObjects(rows) };
        } else if (upperText.startsWith('INSERT')) {
            const stmt = db.prepare(sqliteText);
            const info = stmt.run(...(params || []));
            // Buscar o último registro inserido pelo email (já que temos o params[0])
            const email = params[0];
            const row = db.prepare(`SELECT id, email, name, created_at FROM users WHERE email = ?`).get(email);
            result = { rows: row ? [row] : [] };
        } else if (upperText.startsWith('UPDATE') || upperText.startsWith('DELETE')) {
            const stmt = db.prepare(sqliteText);
            const info = stmt.run(...(params || []));
            result = { rows: [], changes: info.changes };
        } else {
            const stmt = db.prepare(sqliteText);
            stmt.run(...(params || []));
            result = { rows: [] };
        }
        
        const duration = Date.now() - start;
        if (process.env.NODE_ENV === 'development') {
            console.log('Query SQLite em', duration, 'ms');
        }
        
        return Promise.resolve(result);
    } catch (error) {
        console.error('Erro na query SQLite:', { text, params, error: error.message });
        throw error;
    }
};

// Transaction helper
export const transaction = async (callback) => {
    return db.transaction(callback)();
};

// Health check
export const checkDatabase = async () => {
    try {
        await query('SELECT datetime("now") as now');
        return true;
    } catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
};

export default db;
