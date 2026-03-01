/**
 * Controller de Lojas
 * Gerencia requisições de stores
 */

import * as storeService from '../services/store.service.js';
import * as productService from '../services/product.service.js';

/**
 * Criar loja
 * POST /api/stores
 */
export const createStore = async (req, res, next) => {
    try {
        const store = await storeService.createStore(req.user.id, req.body);
        res.status(201).json(store);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                error: error.message,
                code: error.code
            });
        }
        next(error);
    }
};

/**
 * Buscar lojas do usuário
 * GET /api/stores/my
 */
export const getMyStores = async (req, res, next) => {
    try {
        const stores = await storeService.getUserStores(req.user.id);
        res.json(stores);
    } catch (error) {
        next(error);
    }
};

/**
 * Buscar loja por ID
 * GET /api/stores/:id
 */
export const getStore = async (req, res, next) => {
    try {
        const store = await storeService.getStoreById(req.params.id);
        
        if (!store) {
            return res.status(404).json({
                error: 'Loja não encontrada',
                code: 'NOT_FOUND'
            });
        }
        
        res.json(store);
    } catch (error) {
        next(error);
    }
};

/**
 * Buscar loja por slug (página pública)
 * GET /api/stores/slug/:slug
 */
export const getStoreBySlug = async (req, res, next) => {
    try {
        const store = await storeService.getStoreBySlug(req.params.slug);
        
        if (!store) {
            return res.status(404).json({
                error: 'Loja não encontrada',
                code: 'NOT_FOUND'
            });
        }
        
        res.json(store);
    } catch (error) {
        next(error);
    }
};

/**
 * Atualizar loja
 * PUT /api/stores/:id
 */
export const updateStore = async (req, res, next) => {
    try {
        // Verificar se usuário é owner
        const isOwner = await storeService.isStoreOwner(req.params.id, req.user.id);
        
        if (!isOwner) {
            return res.status(403).json({
                error: 'Você não tem permissão para editar esta loja',
                code: 'FORBIDDEN'
            });
        }
        
        const store = await storeService.updateStore(req.params.id, req.body);
        res.json(store);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                error: error.message,
                code: error.code
            });
        }
        next(error);
    }
};

/**
 * Desativar loja
 * DELETE /api/stores/:id
 */
export const deactivateStore = async (req, res, next) => {
    try {
        const isOwner = await storeService.isStoreOwner(req.params.id, req.user.id);
        
        if (!isOwner) {
            return res.status(403).json({
                error: 'Você não tem permissão para esta ação',
                code: 'FORBIDDEN'
            });
        }
        
        const store = await storeService.deactivateStore(req.params.id);
        res.json(store);
    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({
                error: error.message,
                code: error.code
            });
        }
        next(error);
    }
};

/**
 * Dashboard da loja
 * GET /api/stores/:id/dashboard
 */
export const getDashboard = async (req, res, next) => {
    try {
        const isOwner = await storeService.isStoreOwner(req.params.id, req.user.id);
        
        if (!isOwner) {
            return res.status(403).json({
                error: 'Você não tem permissão para acessar este dashboard',
                code: 'FORBIDDEN'
            });
        }
        
        const store = await storeService.getStoreById(req.params.id, true);
        
        // Contar produtos
        const totalProducts = await storeService.getStoreProductCount(req.params.id);
        
        // Contar pedidos (últimos 30 dias)
        const ordersResult = await require('../config/database.js').query(
            `SELECT 
                COUNT(*) as total_orders,
                COUNT(CASE WHEN status = 'pendente' THEN 1 END) as pending_orders,
                COUNT(CASE WHEN status = 'em_preparo' THEN 1 END) as preparing_orders,
                SUM(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN total ELSE 0 END) as revenue_30d
             FROM orders 
             WHERE store_id = $1`,
            [req.params.id]
        );
        
        const stats = ordersResult.rows[0];
        
        res.json({
            store,
            stats: {
                totalProducts,
                totalOrders: parseInt(stats.total_orders),
                pendingOrders: parseInt(stats.pending_orders),
                preparingOrders: parseInt(stats.preparing_orders),
                revenue30d: parseFloat(stats.revenue_30d) || 0
            }
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createStore,
    getMyStores,
    getStore,
    getStoreBySlug,
    updateStore,
    deactivateStore,
    getDashboard
};
