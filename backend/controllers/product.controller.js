/**
 * Controller de Produtos
 * Gerencia requisições de produtos
 */

import * as productService from '../services/product.service.js';
import * as storeService from '../services/store.service.js';

/**
 * Criar produto
 * POST /api/products
 */
export const createProduct = async (req, res, next) => {
    try {
        const { store_id } = req.body;
        
        // Verificar se usuário é owner da loja
        const isOwner = await storeService.isStoreOwner(store_id, req.user.id);
        
        if (!isOwner) {
            return res.status(403).json({
                error: 'Você não tem permissão para adicionar produtos nesta loja',
                code: 'FORBIDDEN'
            });
        }
        
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
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
 * Buscar produtos da loja
 * GET /api/products/store/:storeId
 */
export const getStoreProducts = async (req, res, next) => {
    try {
        const { storeId } = req.params;
        const filters = req.query;
        
        // Se não for owner, só retorna produtos ativos
        const isOwner = await storeService.isStoreOwner(storeId, req.user.id);
        
        if (!isOwner) {
            filters.is_active = true;
        }
        
        const result = await productService.getStoreProducts(storeId, filters);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * Buscar produto por ID
 * GET /api/products/:id
 */
export const getProduct = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                error: 'Produto não encontrado',
                code: 'NOT_FOUND'
            });
        }
        
        res.json(product);
    } catch (error) {
        next(error);
    }
};

/**
 * Atualizar produto
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                error: 'Produto não encontrado',
                code: 'NOT_FOUND'
            });
        }
        
        // Verificar se usuário é owner
        const isOwner = await storeService.isStoreOwner(product.store_id, req.user.id);
        
        if (!isOwner) {
            return res.status(403).json({
                error: 'Você não tem permissão para editar este produto',
                code: 'FORBIDDEN'
            });
        }
        
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        res.json(updatedProduct);
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
 * Excluir produto
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                error: 'Produto não encontrado',
                code: 'NOT_FOUND'
            });
        }
        
        // Verificar se usuário é owner
        const isOwner = await storeService.isStoreOwner(product.store_id, req.user.id);
        
        if (!isOwner) {
            return res.status(403).json({
                error: 'Você não tem permissão para excluir este produto',
                code: 'FORBIDDEN'
            });
        }
        
        const deleted = await productService.deleteProduct(req.params.id);
        res.json(deleted);
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
 * Buscar produtos em destaque
 * GET /api/products/store/:storeId/featured
 */
export const getFeaturedProducts = async (req, res, next) => {
    try {
        const { storeId } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        
        const products = await productService.getFeaturedProducts(storeId, limit);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

/**
 * Atualizar estoque
 * PATCH /api/products/:id/stock
 */
export const updateStock = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                error: 'Produto não encontrado',
                code: 'NOT_FOUND'
            });
        }
        
        // Verificar se usuário é owner
        const isOwner = await storeService.isStoreOwner(product.store_id, req.user.id);
        
        if (!isOwner) {
            return res.status(403).json({
                error: 'Você não tem permissão para esta ação',
                code: 'FORBIDDEN'
            });
        }
        
        const { stock } = req.body;
        
        if (stock === undefined) {
            return res.status(400).json({
                error: 'Quantidade de estoque é obrigatória',
                code: 'VALIDATION_ERROR'
            });
        }
        
        const updated = await productService.updateStock(req.params.id, stock);
        res.json(updated);
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

export default {
    createProduct,
    getStoreProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    updateStock
};
