/**
 * Rotas de Lojas
 */

import { Router } from 'express';
import storeController from '../controllers/store.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Rotas públicas
router.get('/slug/:slug', storeController.getStoreBySlug);

// Rotas protegidas
router.post('/', authenticate, storeController.createStore);
router.get('/my', authenticate, storeController.getMyStores);
router.get('/:id', storeController.getStore);
router.get('/:id/dashboard', authenticate, storeController.getDashboard);
router.put('/:id', authenticate, storeController.updateStore);
router.delete('/:id', authenticate, storeController.deactivateStore);

export default router;
