import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { customerAPI } from '@/services/api';

export default function RecoverPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email) {
            setError('Digite seu e-mail');
            return;
        }

        setIsLoading(true);

        try {
            // Verificar se cliente existe
            const customers = await customerAPI.getAll();
            const customer = customers.find((c: any) => c.email === email);

            if (!customer) {
                setError('E-mail não encontrado');
                return;
            }

            // Gerar senha temporária
            const tempPassword = Math.random().toString(36).slice(-8);
            
            // Salvar senha temporária no localStorage (em produção seria enviado por email)
            const storedCustomers = localStorage.getItem('mock-customers');
            const customersList = storedCustomers ? JSON.parse(storedCustomers) : [];
            const customerIndex = customersList.findIndex((c: any) => c.email === email);
            
            if (customerIndex !== -1) {
                customersList[customerIndex].tempPassword = tempPassword;
                customersList[customerIndex].tempPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutos
                localStorage.setItem('mock-customers', JSON.stringify(customersList));
            }

            // Mostrar senha temporária (em produção seria enviado por email)
            setSent(true);
            
            // Salvar para usar na próxima tela
            sessionStorage.setItem('recover-email', email);
            sessionStorage.setItem('recover-temp-password', tempPassword);
            
        } catch (err: any) {
            setError('Erro ao processar solicitação');
        } finally {
            setIsLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl">Senha Enviada!</CardTitle>
                        <CardDescription>
                            Enviamos uma senha temporária para seu e-mail
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="bg-blue-50 border-blue-300">
                            <div className="space-y-2">
                                <p className="text-sm text-blue-800 font-semibold">
                                    📧 E-mail: {email}
                                </p>
                                <div className="bg-white border border-blue-200 rounded p-3">
                                    <p className="text-xs text-blue-600 mb-1">Senha temporária:</p>
                                    <p className="text-lg font-mono font-bold text-blue-800 select-all">
                                        {sessionStorage.getItem('recover-temp-password')}
                                    </p>
                                </div>
                                <p className="text-xs text-blue-600">
                                    ⏰ Válida por 15 minutos
                                </p>
                            </div>
                        </Alert>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-sm text-yellow-800">
                                💡 <strong>Dica:</strong> Copie esta senha e use para fazer login. 
                                Depois você pode mudar nas configurações da sua conta.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button 
                            onClick={() => navigate('/login')}
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            Ir para Login
                        </Button>
                        <Link
                            to="/login"
                            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Voltar para login
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                            <Mail className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
                    <CardDescription>
                        Digite seu e-mail para receber uma senha temporária
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <span>{error}</span>
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
                                <p className="text-xs text-muted-foreground">
                                    Digite o mesmo e-mail usado no cadastro
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Enviar Senha Temporária
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Link
                        to="/login"
                        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Voltar para login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
