import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/services/api';

interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role?: 'user' | 'admin';
}

interface AuthContextData {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carregar usuário ao iniciar
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            const response = await authAPI.login(email, password);
            
            setToken(response.token);
            setUser(response.user);
            
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login');
            throw err;
        }
    };

    const register = async (email: string, password: string, name: string) => {
        console.log('[AuthContext] register() chamado com:', { email, name, passwordLength: password.length });
        try {
            setError(null);
            console.log('[AuthContext] Iniciando cadastro:', email);

            const response = await authAPI.register(email, password, name);

            console.log('[AuthContext] Cadastro sucesso:', response);

            // Se chegou aqui, cadastro foi completo (sem necessidade de confirmação)
            setToken(response.token);
            setUser(response.user);

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        } catch (err: any) {
            console.error('[AuthContext] Erro no cadastro:', err);
            console.error('[AuthContext] Error details:', {
                message: err?.message,
                code: err?.code,
                status: err?.status
            });

            // Verificar se é erro de confirmação de email - isso é na verdade um "sucesso parcial"
            if (err?.code === 'EMAIL_CONFIRMATION_REQUIRED') {
                console.log('[AuthContext] Requer confirmação de email');
                setError(err.message || 'Cadastro realizado! Verifique seu email para ativar a conta.');
                // Não lançar erro - permitir que o UI mostre a mensagem de sucesso
                return { requiresConfirmation: true, message: err.message };
            } else {
                console.log('[AuthContext] Erro genérico - lançando');
                setError(err.message || 'Erro ao criar conta');
                throw err;
            }
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (data: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                register,
                logout,
                updateUser,
                error,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
}
