/**
 * Rotas de Adicionais
 */

import { Router } from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import * as storeService from '../services/store.service.js';

const router = Router();

// Buscar adicionais (pública)
router.get('/store/:storeId', async (req, res, next) => {
    try {
        const result = await query(
            `SELECT * FROM addons 
             WHERE store_id = $1 AND is_active = true 
             ORDER BY display_order ASC, name ASC`,
            [req.params.storeId]
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Criar adicional
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { store_id, product_id, name, price, is_required, max_quantity, display_order } = req.body;
        
        const isOwner = await storeService.isStoreOwner(store_id, req.user.id);
        if (!isOwner) {
            return res.status(403).json({ error: 'Acesso negado', code: 'FORBIDDEN' });
        }
        
        const result = await query(
            `INSERT INTO addons (store_id, product_id, name, price, is_required, max_quantity, display_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [store_id, product_id, name, price, is_required, max_quantity, display_order || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', authenticate, async (req, res, next) => {
    try {
        const { name, price, is_required, max_quantity, display_order, is_active } = req.body;
        const result = await query(
            `UPDATE addons 
             SET name = COALESCE($1, name),
                 price = COALESCE($2, price),
                 is_required = COALESCE($3, is_required),
                 max_quantity = COALESCE($4, max_quantity),
                 display_order = COALESCE($5, display_order),
                 is_active = COALESCE($6, is_active)
             WHERE id = $7
             RETURNING *`,
            [name, price, is_required, max_quantity, display_order, is_active, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        await query('DELETE FROM addons WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

export default router;
