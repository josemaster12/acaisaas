/**
 * Rotas de Pedidos
 */

import { Router } from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import * as storeService from '../services/store.service.js';

const router = Router();

// Criar pedido (público ou autenticado)
router.post('/', async (req, res, next) => {
    try {
        const {
            store_id,
            customer_name,
            customer_phone,
            customer_email,
            items,
            subtotal,
            delivery_fee,
            discount,
            total,
            payment_method,
            delivery_type,
            delivery_address,
            notes
        } = req.body;
        
        // Validar campos obrigatórios
        if (!store_id || !customer_name || !customer_phone || !items || !total) {
            return res.status(400).json({
                error: 'Campos obrigatórios faltando',
                code: 'VALIDATION_ERROR'
            });
        }
        
        // Criar pedido com transação
        const client = await query('SELECT NOW()', []); // Testa conexão
        
        const orderResult = await query(
            `INSERT INTO orders (
                store_id, customer_id, customer_name, customer_phone, customer_email,
                subtotal, delivery_fee, discount, total, payment_method,
                delivery_type, delivery_address, notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *`,
            [
                store_id,
                req.user?.id || null,
                customer_name,
                customer_phone,
                customer_email,
                subtotal,
                delivery_fee || 0,
                discount || 0,
                total,
                payment_method || 'pix',
                delivery_type || 'delivery',
                delivery_address ? JSON.stringify(delivery_address) : null,
                notes
            ]
        );
        
        const order = orderResult.rows[0];
        
        // Criar itens do pedido
        for (const item of items) {
            await query(
                `INSERT INTO order_items (
                    order_id, product_id, product_name, product_price,
                    quantity, size, addons, subtotal, notes
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    order.id,
                    item.product_id,
                    item.product_name,
                    item.product_price,
                    item.quantity,
                    item.size,
                    JSON.stringify(item.addons || []),
                    item.subtotal,
                    item.notes
                ]
            );
        }
        
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
});

// Buscar pedidos da loja (owner)
router.get('/store/:storeId', authenticate, async (req, res, next) => {
    try {
        const isOwner = await storeService.isStoreOwner(req.params.storeId, req.user.id);
        if (!isOwner) {
            return res.status(403).json({ error: 'Acesso negado', code: 'FORBIDDEN' });
        }
        
        const { status, limit = 50 } = req.query;
        
        let whereClause = 'o.store_id = $1';
        let params = [req.params.storeId];
        
        if (status) {
            whereClause += ' AND o.status = $2';
            params = [req.params.storeId, status];
        }
        
        const result = await query(
            `SELECT o.*, 
                COUNT(oi.id) as items_count
             FROM orders o
             LEFT JOIN order_items oi ON oi.order_id = o.id
             WHERE ${whereClause}
             GROUP BY o.id
             ORDER BY o.created_at DESC
             LIMIT $${params.length + 1}`,
            [...params, parseInt(limit)]
        );
        
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Buscar detalhes do pedido
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const result = await query(
            `SELECT o.*, 
                json_agg(
                    json_build_object(
                        'id', oi.id,
                        'product_name', oi.product_name,
                        'product_price', oi.product_price,
                        'quantity', oi.quantity,
                        'size', oi.size,
                        'addons', oi.addons,
                        'subtotal', oi.subtotal,
                        'notes', oi.notes
                    )
                ) as items
             FROM orders o
             LEFT JOIN order_items oi ON oi.order_id = o.id
             WHERE o.id = $1
             GROUP BY o.id`,
            [req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado', code: 'NOT_FOUND' });
        }
        
        const order = result.rows[0];
        order.items = order.items.filter(i => i.id !== null);
        
        res.json(order);
    } catch (error) {
        next(error);
    }
});

// Atualizar status do pedido
router.patch('/:id/status', authenticate, async (req, res, next) => {
    try {
        const { status, estimated_time } = req.body;
        
        // Buscar pedido para verificar loja
        const orderCheck = await query('SELECT store_id FROM orders WHERE id = $1', [req.params.id]);
        if (orderCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado', code: 'NOT_FOUND' });
        }
        
        const isOwner = await storeService.isStoreOwner(orderCheck.rows[0].store_id, req.user.id);
        if (!isOwner) {
            return res.status(403).json({ error: 'Acesso negado', code: 'FORBIDDEN' });
        }
        
        const updates = [];
        const values = [];
        
        if (status) {
            updates.push(`status = $${values.length + 1}`);
            values.push(status);
            
            if (status === 'entregue' || status === 'cancelado') {
                updates.push(`completed_at = NOW()`);
            }
        }
        
        if (estimated_time) {
            updates.push(`estimated_time = $${values.length + 1}`);
            values.push(estimated_time);
        }
        
        updates.push(`updated_at = NOW()`);
        values.push(req.params.id);
        
        const result = await query(
            `UPDATE orders SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
            values
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

export default router;
