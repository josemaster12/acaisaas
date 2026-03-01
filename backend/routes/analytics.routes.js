/**
 * Rotas de Analytics
 */

import { Router } from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import * as storeService from '../services/store.service.js';

const router = Router();

// Dashboard analytics
router.get('/dashboard/:storeId', authenticate, async (req, res, next) => {
    try {
        const isOwner = await storeService.isStoreOwner(req.params.storeId, req.user.id);
        if (!isOwner) {
            return res.status(403).json({ error: 'Acesso negado', code: 'FORBIDDEN' });
        }
        
        const { period = '30' } = req.query;
        
        // Receita total no período
        const revenueResult = await query(
            `SELECT 
                SUM(total) as revenue,
                COUNT(*) as orders,
                AVG(total) as avg_ticket
             FROM orders
             WHERE store_id = $1 
                AND status != 'cancelado'
                AND created_at >= NOW() - INTERVAL '${period} days'`,
            [req.params.storeId]
        );
        
        // Vendas por dia (gráfico)
        const dailyResult = await query(
            `SELECT 
                DATE(created_at) as date,
                SUM(total) as revenue,
                COUNT(*) as orders
             FROM orders
             WHERE store_id = $1 
                AND status != 'cancelado'
                AND created_at >= NOW() - INTERVAL '${period} days'
             GROUP BY DATE(created_at)
             ORDER BY date ASC`,
            [req.params.storeId]
        );
        
        // Produtos mais vendidos
        const topProductsResult = await query(
            `SELECT 
                oi.product_name,
                SUM(oi.quantity) as total_sold,
                SUM(oi.subtotal) as revenue
             FROM order_items oi
             JOIN orders o ON o.id = oi.order_id
             WHERE o.store_id = $1 
                AND o.status != 'cancelado'
                AND o.created_at >= NOW() - INTERVAL '${period} days'
             GROUP BY oi.product_id, oi.product_name
             ORDER BY total_sold DESC
             LIMIT 10`,
            [req.params.storeId]
        );
        
        // Status dos pedidos
        const statusResult = await query(
            `SELECT 
                status,
                COUNT(*) as count
             FROM orders
             WHERE store_id = $1 
                AND created_at >= NOW() - INTERVAL '${period} days'
             GROUP BY status`,
            [req.params.storeId]
        );
        
        res.json({
            period: parseInt(period),
            revenue: parseFloat(revenueResult.rows[0].revenue) || 0,
            totalOrders: parseInt(revenueResult.rows[0].orders) || 0,
            avgTicket: parseFloat(revenueResult.rows[0].avg_ticket) || 0,
            dailyRevenue: dailyResult.rows,
            topProducts: topProductsResult.rows,
            ordersByStatus: statusResult.rows
        });
    } catch (error) {
        next(error);
    }
});

export default router;
