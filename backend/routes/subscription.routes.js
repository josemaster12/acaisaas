/**
 * Rotas de Subscrições (SaaS)
 */

import { Router } from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Buscar planos disponíveis
router.get('/plans', async (req, res, next) => {
    try {
        const result = await query(
            `SELECT * FROM plans ORDER BY price ASC`,
            []
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Buscar subscrição da loja
router.get('/store/:storeId', authenticate, async (req, res, next) => {
    try {
        const result = await query(
            `SELECT s.*, p.name as plan_name, p.type as plan_type, 
                p.max_products, p.price as plan_price, p.features
             FROM subscriptions s
             JOIN plans p ON s.plan_id = p.id
             WHERE s.store_id = $1`,
            [req.params.storeId]
        );
        
        if (result.rows.length === 0) {
            return res.json(null);
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Upgrade de plano (simulado - em produção integrar com Stripe/Mercado Pago)
router.post('/upgrade', authenticate, async (req, res, next) => {
    try {
        const { store_id, plan_id } = req.body;
        
        // Verificar se plano existe
        const planCheck = await query('SELECT * FROM plans WHERE id = $1', [plan_id]);
        if (planCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Plano inválido', code: 'INVALID_PLAN' });
        }
        
        // Upsert subscription
        const result = await query(
            `INSERT INTO subscriptions (store_id, plan_id, status, current_period_start, current_period_end)
             VALUES ($1, $2, 'active', NOW(), NOW() + INTERVAL '30 days')
             ON CONFLICT (store_id) DO UPDATE SET
                plan_id = EXCLUDED.plan_id,
                status = 'active',
                updated_at = NOW()
             RETURNING *`,
            [store_id, plan_id]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

export default router;
