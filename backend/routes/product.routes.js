/**
 * Rotas de Produtos
 */

import { Router } from 'express';
import productController from '../controllers/product.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Rotas públicas (produtos de loja ativa)
router.get('/store/:storeId', productController.getStoreProducts);
router.get('/store/:storeId/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProduct);

// Rotas protegidas
router.post('/', authenticate, productController.createProduct);
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);
router.patch('/:id/stock', authenticate, productController.updateStock);

export default router;
