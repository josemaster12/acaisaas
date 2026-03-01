/**
 * Servidor Principal - Pronto Açaí Now API
 * Backend para sistema SaaS de gerenciamento de lojas de açaí
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rotas
import authRoutes from '../routes/auth.routes.js';
import storeRoutes from '../routes/store.routes.js';
import productRoutes from '../routes/product.routes.js';
import categoryRoutes from '../routes/category.routes.js';
import orderRoutes from '../routes/order.routes.js';
import addonRoutes from '../routes/addon.routes.js';
import subscriptionRoutes from '../routes/subscription.routes.js';
import analyticsRoutes from '../routes/analytics.routes.js';
import uploadRoutes from '../routes/upload.routes.js';

// Carregar variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Headers de segurança
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Servir arquivos estáticos para uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addons', addonRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'Pronto Açaí Now API'
    });
});

// Rota padrão
app.get('/', (req, res) => {
    res.json({
        name: 'Pronto Açaí Now API',
        version: '1.0.0',
        description: 'Sistema SaaS para gerenciamento de lojas de açaí',
        endpoints: {
            auth: '/api/auth',
            stores: '/api/stores',
            products: '/api/products',
            categories: '/api/categories',
            orders: '/api/orders',
            addons: '/api/addons',
            subscriptions: '/api/subscriptions',
            analytics: '/api/analytics',
            upload: '/api/upload'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler global
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Erro interno do servidor',
            code: err.code || 'INTERNAL_ERROR'
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║     🍧 Pronto Açaí Now API - Servidor Iniciado!       ║
╠════════════════════════════════════════════════════════╣
║  Porta: ${PORT}                                        
║  Ambiente: ${process.env.NODE_ENV || 'development'}                        
║  URL: http://localhost:${PORT}                         
╚════════════════════════════════════════════════════════╝
    `);
});

export default app;
