/**
 * Rotas de Upload
 */

import { Router } from 'express';
import upload from '../middleware/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload de imagem única
router.post('/image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'Nenhum arquivo enviado',
                code: 'NO_FILE'
            });
        }
        
        // URL relativa para acesso
        const imageUrl = `/uploads/${req.file.filename}`;
        
        res.json({
            success: true,
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: imageUrl
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            code: 'UPLOAD_ERROR'
        });
    }
});

export default router;
