import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI, storesAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, IceCream } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { login, error, clearError } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        clearError();

        try {
            // Fazer login e obter resposta completa
            const response = await authAPI.login(email, password);
            
            // Usar o contexto para salvar os dados
            await login(email, password);
            
            // Redirecionar baseado no tipo de usuário
            if (response.user.role === 'admin') {
                navigate('/admin');
            } else {
                // Lojista: buscar lojas do usuário e ir para a primeira
                try {
                    const userStores = await storesAPI.getAll(response.user.id);
                    if (userStores && userStores.length > 0) {
                        navigate(`/dashboard/loja/${userStores[0].id}`);
                    } else {
                        // Sem lojas: vai para dashboard geral para criar uma
                        navigate('/dashboard');
                    }
                } catch (err) {
                    navigate('/dashboard');
                }
            }
        } catch (err: any) {
            // Erro já tratado no contexto
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                            <IceCream className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Pronto Açaí Now</CardTitle>
                    <CardDescription>
                        Acesse o painel da sua loja
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            
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
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                Entrar
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <Link
                        to="/recuperar-senha"
                        className="text-sm text-purple-600 hover:underline"
                    >
                        Esqueceu a senha?
                    </Link>
                    <div className="space-y-1 w-full">
                        <p className="text-sm text-muted-foreground text-center">
                            Não tem uma conta?{' '}
                            <Link to="/cadastro" className="text-green-600 hover:underline font-medium">
                                Cadastro de Cliente
                            </Link>
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                            Quer abrir uma loja?{' '}
                            <Link to="/cadastro-lojista" className="text-purple-600 hover:underline">
                                Cadastro de Lojista
                            </Link>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
