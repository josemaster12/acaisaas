/**
 * Serviço de Lojas (Stores)
 * Gerencia CRUD de lojas e configurações
 */

import { query } from '../config/database.js';

/**
 * Criar nova loja
 */
export const createStore = async (ownerId, data) => {
    try {
        const {
            name,
            slug,
            description,
            logo_url,
            primary_color,
            whatsapp,
            opening_time,
            closing_time,
            delivery_fee,
            min_order_value,
            address
        } = data;
        
        // Verificar se slug já existe
        const existingSlug = await query(
            'SELECT id FROM stores WHERE slug = $1',
            [slug]
        );
        
        if (existingSlug.rows.length > 0) {
            throw { 
                status: 400, 
                message: 'Este nome de loja já está em uso. Escolha outro.',
                code: 'SLUG_EXISTS'
            };
        }
        
        // Verificar se usuário já tem loja (para plano gratuito)
        const existingStore = await query(
            'SELECT s.*, p.type as plan_type FROM stores s JOIN plans p ON s.plan_id = p.id WHERE s.owner_id = $1',
            [ownerId]
        );
        
        if (existingStore.rows.length > 0 && existingStore.rows[0].plan_type === 'gratuito') {
            throw { 
                status: 400, 
                message: 'Você já possui uma loja no plano gratuito. Faça upgrade para criar mais.',
                code: 'PLAN_LIMIT'
            };
        }
        
        const result = await query(
            `INSERT INTO stores (
                owner_id, name, slug, description, logo_url, primary_color,
                whatsapp, opening_time, closing_time, delivery_fee,
                min_order_value, address
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [
                ownerId,
                name,
                slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                description,
                logo_url,
                primary_color || '#7c3aed',
                whatsapp,
                opening_time || '09:00:00',
                closing_time || '22:00:00',
                delivery_fee || 0,
                min_order_value || 0,
                address ? JSON.stringify(address) : null
            ]
        );
        
        return result.rows[0];
    } catch (error) {
        if (error.status) throw error;
        console.error('Erro ao criar loja:', error);
        throw { 
            status: 500, 
            message: 'Erro ao criar loja',
            code: 'CREATE_ERROR'
        };
    }
};

/**
 * Buscar loja por ID
 */
export const getStoreById = async (storeId, includeInactive = false) => {
    try {
        const condition = includeInactive ? 'id = $1' : 'id = $1 AND is_active = true';
        
        const result = await query(
            `SELECT s.*, p.name as plan_name, p.type as plan_type
             FROM stores s
             LEFT JOIN plans p ON s.plan_id = p.id
             WHERE ${condition}`,
            [storeId]
        );
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao buscar loja:', error);
        throw error;
    }
};

/**
 * Buscar loja por slug (para página pública)
 */
export const getStoreBySlug = async (slug) => {
    try {
        const result = await query(
            `SELECT s.*, p.name as plan_name, p.type as plan_type
             FROM stores s
             LEFT JOIN plans p ON s.plan_id = p.id
             WHERE s.slug = $1 AND s.is_active = true`,
            [slug]
        );
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao buscar loja por slug:', error);
        throw error;
    }
};

/**
 * Buscar lojas do usuário
 */
export const getUserStores = async (userId) => {
    try {
        const result = await query(
            `SELECT s.*, p.name as plan_name, p.type as plan_type, p.max_products
             FROM stores s
             LEFT JOIN plans p ON s.plan_id = p.id
             WHERE s.owner_id = $1
             ORDER BY s.created_at DESC`,
            [userId]
        );
        
        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar lojas do usuário:', error);
        throw error;
    }
};

/**
 * Atualizar loja
 */
export const updateStore = async (storeId, updates) => {
    try {
        const allowedFields = [
            'name', 'slug', 'description', 'logo_url', 'primary_color',
            'whatsapp', 'opening_time', 'closing_time', 
            'delivery_fee', 'min_order_value', 'address'
        ];
        
        const fields = [];
        const values = [];
        let paramIndex = 1;
        
        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                if (key === 'address') {
                    fields.push(`${key} = $${paramIndex}::jsonb`);
                } else {
                    fields.push(`${key} = $${paramIndex}`);
                }
                values.push(key === 'slug' ? value.toLowerCase().replace(/[^a-z0-9-]/g, '-') : value);
                paramIndex++;
            }
        }
        
        if (fields.length === 0) {
            throw { 
                status: 400, 
                message: 'Nenhum campo válido para atualizar',
                code: 'NO_VALID_FIELDS'
            };
        }
        
        fields.push(`updated_at = NOW()`);
        values.push(storeId);
        
        const result = await query(
            `UPDATE stores SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );
        
        if (result.rows.length === 0) {
            throw { 
                status: 404, 
                message: 'Loja não encontrada',
                code: 'NOT_FOUND'
            };
        }
        
        return result.rows[0];
    } catch (error) {
        if (error.status) throw error;
        console.error('Erro ao atualizar loja:', error);
        throw { 
            status: 500, 
            message: 'Erro ao atualizar loja',
            code: 'UPDATE_ERROR'
        };
    }
};

/**
 * Desativar loja
 */
export const deactivateStore = async (storeId) => {
    try {
        const result = await query(
            `UPDATE stores 
             SET is_active = false, updated_at = NOW()
             WHERE id = $1
             RETURNING id, name, is_active`,
            [storeId]
        );
        
        if (result.rows.length === 0) {
            throw { 
                status: 404, 
                message: 'Loja não encontrada',
                code: 'NOT_FOUND'
            };
        }
        
        return result.rows[0];
    } catch (error) {
        if (error.status) throw error;
        console.error('Erro ao desativar loja:', error);
        throw { 
            status: 500, 
            message: 'Erro ao desativar loja',
            code: 'DEACTIVATE_ERROR'
        };
    }
};

/**
 * Ativar loja
 */
export const activateStore = async (storeId) => {
    try {
        const result = await query(
            `UPDATE stores 
             SET is_active = true, updated_at = NOW()
             WHERE id = $1
             RETURNING id, name, is_active`,
            [storeId]
        );
        
        if (result.rows.length === 0) {
            throw { 
                status: 404, 
                message: 'Loja não encontrada',
                code: 'NOT_FOUND'
            };
        }
        
        return result.rows[0];
    } catch (error) {
        if (error.status) throw error;
        console.error('Erro ao ativar loja:', error);
        throw { 
            status: 500, 
            message: 'Erro ao ativar loja',
            code: 'ACTIVATE_ERROR'
        };
    }
};

/**
 * Verificar se usuário é owner da loja
 */
export const isStoreOwner = async (storeId, userId) => {
    try {
        const result = await query(
            'SELECT id FROM stores WHERE id = $1 AND owner_id = $2',
            [storeId, userId]
        );
        
        return result.rows.length > 0;
    } catch (error) {
        console.error('Erro ao verificar ownership:', error);
        return false;
    }
};

/**
 * Contar produtos da loja
 */
export const getStoreProductCount = async (storeId) => {
    try {
        const result = await query(
            'SELECT COUNT(*) as count FROM products WHERE store_id = $1 AND is_active = true',
            [storeId]
        );
        
        return parseInt(result.rows[0].count);
    } catch (error) {
        console.error('Erro ao contar produtos:', error);
        return 0;
    }
};

export default {
    createStore,
    getStoreById,
    getStoreBySlug,
    getUserStores,
    updateStore,
    deactivateStore,
    activateStore,
    isStoreOwner,
    getStoreProductCount
};
