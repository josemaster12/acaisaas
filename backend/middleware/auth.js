/**
 * Middleware de Autenticação JWT
 * Verifica e valida tokens de acesso
 */

import jwt from 'jsonwebtoken';

/**
 * Verifica se o usuário está autenticado
 * Adiciona req.user com os dados do usuário
 */
export const authenticate = (req, res, next) => {
    try {
        // Pegar token do header
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'Token de autenticação não fornecido',
                code: 'TOKEN_MISSING'
            });
        }
        
        // Formato: "Bearer <token>"
        const parts = authHeader.split(' ');
        
        if (parts.length !== 2) {
            return res.status(401).json({ 
                error: 'Formato de token inválido',
                code: 'TOKEN_INVALID'
            });
        }
        
        const [scheme, token] = parts;
        
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ 
                error: 'Formato de token inválido. Use: Bearer <token>',
                code: 'TOKEN_INVALID'
            });
        }
        
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Adicionar usuário ao request
        req.user = {
            id: decoded.sub || decoded.id,
            email: decoded.email,
            role: decoded.role || 'user'
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expirado',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Token inválido',
                code: 'TOKEN_INVALID'
            });
        }
        
        console.error('Erro na autenticação:', error);
        return res.status(500).json({ 
            error: 'Erro interno na autenticação',
            code: 'AUTH_ERROR'
        });
    }
};

/**
 * Middleware opcional de autenticação
 * Não falha se não houver token, apenas adiciona req.user se válido
 */
export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return next();
        }
        
        const parts = authHeader.split(' ');
        
        if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
            const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);
            req.user = {
                id: decoded.sub || decoded.id,
                email: decoded.email,
                role: decoded.role || 'user'
            };
        }
    } catch (error) {
        // Ignora erros de autenticação
    }
    
    next();
};

/**
 * Verifica se o usuário é owner de uma loja específica
 * @param {string} storeParamName - Nome do parâmetro na URL que contém o store_id
 */
export const isStoreOwner = (storeParamName = 'storeId') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                error: 'Autenticação necessária',
                code: 'AUTH_REQUIRED'
            });
        }
        
        const storeId = req.params[storeParamName] || req.body.store_id;
        
        if (!storeId) {
            return res.status(400).json({ 
                error: 'ID da loja não fornecido',
                code: 'STORE_ID_MISSING'
            });
        }
        
        // Verificar se usuário é owner da loja
        // Isso será validado no controller/serviço com acesso ao banco
        req.storeId = storeId;
        next();
    };
};

/**
 * Middleware para verificar permissões de admin
 */
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            error: 'Autenticação necessária',
            code: 'AUTH_REQUIRED'
        });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            error: 'Acesso negado. Permissões de administrador necessárias.',
            code: 'FORBIDDEN'
        });
    }
    
    next();
};

export default {
    authenticate,
    optionalAuth,
    isStoreOwner,
    isAdmin
};
