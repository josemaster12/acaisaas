/**
 * Rotas de Categorias
 */

import { Router } from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import * as storeService from '../services/store.service.js';

const router = Router();

// Buscar categorias da loja (pública)
router.get('/store/:storeId', async (req, res, next) => {
    try {
        const { storeId } = req.params;
        const result = await query(
            `SELECT * FROM categories 
             WHERE store_id = $1 AND is_active = true 
             ORDER BY display_order ASC, name ASC`,
            [storeId]
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Rotas protegidas
router.post('/', authenticate, async (req, res, next) => {
    try {
        const { store_id, name, type, description, icon, display_order } = req.body;
        
        const isOwner = await storeService.isStoreOwner(store_id, req.user.id);
        if (!isOwner) {
            return res.status(403).json({ error: 'Acesso negado', code: 'FORBIDDEN' });
        }
        
        const result = await query(
            `INSERT INTO categories (store_id, name, type, description, icon, display_order)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [store_id, name, type, description, icon, display_order || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', authenticate, async (req, res, next) => {
    try {
        const { name, description, icon, display_order, is_active } = req.body;
        const result = await query(
            `UPDATE categories 
             SET name = COALESCE($1, name),
                 description = COALESCE($2, description),
                 icon = COALESCE($3, icon),
                 display_order = COALESCE($4, display_order),
                 is_active = COALESCE($5, is_active),
                 updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [name, description, icon, display_order, is_active, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        await query('DELETE FROM categories WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

export default router;
