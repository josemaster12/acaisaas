/**
 * Serviço de Produtos
 * Gerencia CRUD de produtos
 */

import { query } from '../config/database.js';

/**
 * Criar produto
 */
export const createProduct = async (data) => {
    try {
        const {
            store_id,
            category_id,
            name,
            description,
            price,
            image_url,
            sizes,
            stock,
            is_featured,
            preparation_time,
            calories,
            allergens
        } = data;
        
        const result = await query(
            `INSERT INTO products (
                store_id, category_id, name, description, price, image_url,
                sizes, stock, is_featured, preparation_time, calories, allergens
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *`,
            [
                store_id,
                category_id,
                name,
                description,
                price,
                image_url,
                sizes ? JSON.stringify(sizes) : null,
                stock !== undefined ? stock : -1,
                is_featured || false,
                preparation_time || 0,
                calories,
                allergens ? JSON.stringify(allergens) : null
            ]
        );
        
        return result.rows[0];
    } catch (error) {
        if (error.status) throw error;
        console.error('Erro ao criar produto:', error);
        throw { 
            status: 500, 
            message: 'Erro ao criar produto',
            code: 'CREATE_ERROR'
        };
    }
};

/**
 * Buscar produto por ID
 */
export const getProductById = async (productId, storeId = null) => {
    try {
        let whereClause = 'p.id = $1';
        let params = [productId];
        
        if (storeId) {
            whereClause += ' AND p.store_id = $2';
            params = [productId, storeId];
        }
        
        const result = await query(
            `SELECT p.*, c.name as category_name
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE ${whereClause}`,
            params
        );
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0];
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        throw error;
    }
};

/**
 * Buscar produtos da loja com filtros
 */
export const getStoreProducts = async (storeId, filters = {}) => {
    try {
        const {
            category_id,
            search,
            is_active,
            is_featured,
            limit = 100,
            offset = 0,
            order_by = 'created_at',
            order = 'DESC'
        } = filters;
        
        let whereClause = 'p.store_id = $1';
        let params = [storeId];
        let paramIndex = 2;
        
        if (category_id) {
            whereClause += ` AND p.category_id = $${paramIndex}`;
            params.push(category_id);
            paramIndex++;
        }
        
        if (search) {
            whereClause += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
            params.push(`%${search}%`);
            paramIndex++;
        }
        
        if (is_active !== undefined) {
            whereClause += ` AND p.is_active = $${paramIndex}`;
            params.push(is_active);
            paramIndex++;
        }
        
        if (is_featured !== undefined) {
            whereClause += ` AND p.is_featured = $${paramIndex}`;
            params.push(is_featured);
            paramIndex++;
        }
        
        // Ordenação
        const allowedOrders = ['name', 'price', 'created_at', 'updated_at'];
        const orderBy = allowedOrders.includes(order_by) ? order_by : 'created_at';
        const orderDir = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        const result = await query(
            `SELECT p.*, c.name as category_name
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE ${whereClause}
             ORDER BY p.${orderBy} ${orderDir}
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...params, limit, offset]
        );
        
        // Contar total
        const countResult = await query(
            `SELECT COUNT(*) as total FROM products p WHERE ${whereClause}`,
            params
        );
        
        return {
            products: result.rows,
            total: parseInt(countResult.rows[0].total),
            limit,
            offset
        };
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
};

/**
 * Atualizar produto
 */
export const updateProduct = async (productId, updates) => {
    try {
        const allowedFields = [
            'category_id', 'name', 'description', 'price', 'image_url',
            'sizes', 'stock', 'is_active', 'is_featured', 
            'preparation_time', 'calories', 'allergens'
        ];
        
        const fields = [];
        const values = [];
        let paramIndex = 1;
        
        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                if (['sizes', 'allergens'].includes(key)) {
                    fields.push(`${key} = $${paramIndex}::jsonb`);
                } else {
                    fields.push(`${key} = $${paramIndex}`);
                }
                values.push(value);
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
        values.push(productId);
        
        const result = await query(
            `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );
        
        if (result.rows.length === 0) {
            throw { 
                status: 404, 
                message: 'Produto não encontrado',
                code: 'NOT_FOUND'
            };
        }
        
        return result.rows[0];
    } catch (error) {
        if (error.status) throw error;
        console.error('Erro ao atualizar produto:', error);
        throw { 
            status: 500, 
            message: 'Erro ao atualizar produto',
            code: 'UPDATE_ERROR'
        };
    }
};

/**
 * Excluir produto
 */
export const deleteProduct = async (productId) => {
    try {
        const result = await query(
            'DELETE FROM products WHERE id = $1 RETURNING id, name',
            [productId]
        );
        
        if (result.rows.length === 0) {
            throw { 
                status: 404, 
                message: 'Produto não encontrado',
                code: 'NOT_FOUND'
            };
        }
        
        return result.rows[0];
    } catch (error) {
        if (error.status) throw error;
        console.error('Erro ao excluir produto:', error);
        throw { 
            status: 500, 
            message: 'Erro ao excluir produto',
            code: 'DELETE_ERROR'
        };
    }
};

/**
 * Buscar produtos em destaque
 */
export const getFeaturedProducts = async (storeId, limit = 10) => {
    try {
        const result = await query(
            `SELECT p.*, c.name as category_name
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.store_id = $1 AND p.is_active = true AND p.is_featured = true
             ORDER BY p.created_at DESC
             LIMIT $2`,
            [storeId, limit]
        );
        
        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar produtos em destaque:', error);
        return [];
    }
};

/**
 * Buscar produtos por categoria (página pública)
 */
export const getProductsByCategory = async (storeId, categoryId) => {
    try {
        const result = await query(
            `SELECT p.*, c.name as category_name
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE p.store_id = $1 AND p.category_id = $2 AND p.is_active = true
             ORDER BY p.name ASC`,
            [storeId, categoryId]
        );
        
        return result.rows;
    } catch (error) {
        console.error('Erro ao buscar produtos por categoria:', error);
        return [];
    }
};

/**
 * Atualizar estoque
 */
export const updateStock = async (productId, stock) => {
    try {
        const result = await query(
            `UPDATE products 
             SET stock = $1, updated_at = NOW()
             WHERE id = $2
             RETURNING id, name, stock`,
            [stock, productId]
        );
        
        if (result.rows.length === 0) {
            throw { 
                status: 404, 
                message: 'Produto não encontrado',
                code: 'NOT_FOUND'
            };
        }
        
        return result.rows[0];
    } catch (error) {
        if (error.status) throw error;
        console.error('Erro ao atualizar estoque:', error);
        throw { 
            status: 500, 
            message: 'Erro ao atualizar estoque',
            code: 'STOCK_ERROR'
        };
    }
};

export default {
    createProduct,
    getProductById,
    getStoreProducts,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getProductsByCategory,
    updateStock
};
