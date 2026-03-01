/**
 * Middleware de Upload de Arquivos (Multer)
 * Configuração para upload de imagens de produtos
 */

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Diretório de uploads
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');

// Criar diretório se não existir
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Gerar nome único: timestamp + random + extensão
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const safeName = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-');
        cb(null, `${safeName}-${uniqueSuffix}${ext}`);
    }
});

// Filtro de arquivos aceitos
const fileFilter = (req, file, cb) => {
    // Tipos MIME aceitos
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.'), false);
    }
};

// Configuração do multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB padrão
        files: 1 // Apenas 1 arquivo por vez
    }
});

// Handler de erro do multer
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'Arquivo muito grande. Tamanho máximo: 5MB',
                code: 'FILE_TOO_LARGE'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: 'Número máximo de arquivos excedido',
                code: 'TOO_MANY_FILES'
            });
        }
        return res.status(400).json({
            error: `Erro no upload: ${err.message}`,
            code: 'UPLOAD_ERROR'
        });
    }
    
    if (err) {
        return res.status(400).json({
            error: err.message,
            code: 'FILE_TYPE_NOT_ALLOWED'
        });
    }
    
    next();
};

export default upload;
