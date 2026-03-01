/**
 * Controller de Autenticação
 * Gerencia requisições de auth
 */

import * as authService from '../services/auth.service.js';

/**
 * Registrar usuário
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        
        // Validação básica
        if (!email || !password) {
            return res.status(400).json({
                error: 'E-mail e senha são obrigatórios',
                code: 'VALIDATION_ERROR'
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                error: 'A senha deve ter pelo menos 6 caracteres',
                code: 'VALIDATION_ERROR'
            });
        }
        
        const result = await authService.register(email, password, name || email.split('@')[0]);
        
        res.status(201).json(result);
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
 * Fazer login
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                error: 'E-mail e senha são obrigatórios',
                code: 'VALIDATION_ERROR'
            });
        }
        
        const result = await authService.login(email, password);
        
        res.json(result);
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
 * Buscar perfil do usuário
 * GET /api/auth/me
 */
export const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado',
                code: 'NOT_FOUND'
            });
        }
        
        res.json(user);
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
 * Atualizar perfil
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { name, phone } = req.body;
        
        const user = await authService.updateProfile(req.user.id, { name, phone });
        
        res.json(user);
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
 * Solicitar recuperação de senha
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                error: 'E-mail é obrigatório',
                code: 'VALIDATION_ERROR'
            });
        }
        
        const result = await authService.requestPasswordReset(email);
        
        res.json(result);
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
    register,
    login,
    getProfile,
    updateProfile,
    forgotPassword
};
