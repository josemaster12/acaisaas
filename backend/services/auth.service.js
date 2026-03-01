/**
 * Serviço de Autenticação
 * Gerencia login, registro e tokens JWT
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

/**
 * Gerar token JWT
 */
export const generateToken = (userId, email, role = 'user') => {
    return jwt.sign(
        {
            sub: userId,
            email,
            role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token válido por 7 dias
    );
};

/**
 * Registrar novo usuário
 */
export const register = async (email, password, name) => {
    try {
        console.log('Tentando registrar usuário:', email);
        
        // Verificar se usuário já existe
        const existingUserResult = await query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        
        console.log('Resultado da query:', existingUserResult);

        if (existingUserResult.rows && existingUserResult.rows.length > 0) {
            throw {
                status: 400,
                message: 'E-mail já cadastrado',
                code: 'EMAIL_EXISTS'
            };
        }

        console.log('E-mail disponível, criando hash da senha...');
        
        // Hash da senha
        const passwordHash = await bcrypt.hash(password, 10);
        console.log('Hash gerado, inserindo no banco...');

        // Criar usuário na tabela users
        const result = await query(
            `INSERT INTO users (email, password_hash, name, created_at, updated_at)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING id, email, name, created_at`,
            [email, passwordHash, name]
        );

        console.log('Resultado do insert:', result);
        
        const user = result.rows && result.rows[0] ? result.rows[0] : { id: 'generated', email, name };
        console.log('Usuário criado com sucesso:', user.id);

        // Gerar token
        const token = generateToken(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        };
    } catch (error) {
        console.error('Erro detalhado no registro:', error);
        if (error.status) throw error;
        throw {
            status: 500,
            message: error.message || 'Erro ao criar usuário',
            code: 'REGISTER_ERROR'
        };
    }
};

/**
 * Fazer login
 */
export const login = async (email, password) => {
    try {
        // Buscar usuário
        const result = await query(
            'SELECT id, email, password_hash, name FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            throw {
                status: 401,
                message: 'E-mail ou senha inválidos',
                code: 'INVALID_CREDENTIALS'
            };
        }

        const user = result.rows[0];

        // Verificar senha
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            throw {
                status: 401,
                message: 'E-mail ou senha inválidos',
                code: 'INVALID_CREDENTIALS'
            };
        }

        // Gerar token
        const token = generateToken(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name || email.split('@')[0]
            },
            token
        };
    } catch (error) {
        if (error.status) throw error;
        console.error('Erro no login:', error);
        throw {
            status: 500,
            message: 'Erro ao fazer login',
            code: 'LOGIN_ERROR'
        };
    }
};

/**
 * Recuperar usuário por ID
 */
export const getUserById = async (userId) => {
    try {
        const result = await query(
            'SELECT id, email, name, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const user = result.rows[0];

        return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            created_at: user.created_at
        };
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
};

/**
 * Atualizar perfil do usuário
 */
export const updateProfile = async (userId, updates) => {
    try {
        const { name, phone } = updates;

        const result = await query(
            `UPDATE users
             SET name = COALESCE($1, name),
                 phone = COALESCE($2, phone),
                 updated_at = NOW()
             WHERE id = $3
             RETURNING id, email, name, phone`,
            [name, phone, userId]
        );

        const user = result.rows[0];

        return {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            phone: user.phone
        };
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        throw {
            status: 500,
            message: 'Erro ao atualizar perfil',
            code: 'UPDATE_ERROR'
        };
    }
};

/**
 * Solicitar recuperação de senha
 */
export const requestPasswordReset = async (email) => {
    try {
        // Verificar se usuário existe
        const result = await query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        // Sempre retornar sucesso para não revelar se e-mail existe
        return {
            success: true,
            message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.'
        };
    } catch (error) {
        console.error('Erro na recuperação de senha:', error);
        throw {
            status: 500,
            message: 'Erro ao processar solicitação',
            code: 'RESET_ERROR'
        };
    }
};

export default {
    generateToken,
    register,
    login,
    getUserById,
    updateProfile,
    requestPasswordReset
};
