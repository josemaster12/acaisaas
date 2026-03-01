import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Store } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const { register, error, clearError } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            await register(email, password, name);
            // Sucesso - redirecionar
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Erro no cadastro:', err);
            // Erro já foi tratado no contexto
            // Não re-lançar para não travar a UI
        } finally {
            setIsLoading(false);
        }
    };

    const setError = (msg: string) => {
        const event = new CustomEvent('auth-error', { detail: msg });
        window.dispatchEvent(event);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                            <Store className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Cadastro de Lojista</CardTitle>
                    <CardDescription>
                        Crie sua conta para gerenciar lojas
                    </CardDescription>
                    <Alert className="mt-4 bg-yellow-50 border-yellow-300">
                        <AlertDescription className="text-sm text-yellow-800">
                            ⚠️ <strong>Atenção:</strong> Este cadastro é apenas para donos de loja.
                        </AlertDescription>
                    </Alert>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Seu nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Repita a senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Criar Conta de Lojista
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-purple-600 hover:underline">
                            Fazer login
                        </Link>
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                        É cliente? Quer fazer pedidos?{' '}
                        <Link to="/cadastro" className="text-green-600 hover:underline">
                            Cadastro de clientes
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
