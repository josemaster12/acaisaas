import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Loader2, IceCream, User } from 'lucide-react';
import { customerAPI } from '@/services/api';

export default function CustomerRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        reference: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (formData.phone.length < 10) {
            setError('Digite um WhatsApp válido com DDD');
            return;
        }

        setIsLoading(true);

        try {
            // Cadastrar cliente
            await customerAPI.register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                address: {
                    street: formData.street,
                    number: formData.number,
                    neighborhood: formData.neighborhood,
                    city: formData.city,
                    reference: formData.reference,
                },
            });

            alert('✅ Conta criada com sucesso! Faça login para pedir.');
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta');
        } finally {
            setIsLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Criar Conta de Cliente</CardTitle>
                    <CardDescription>
                        Cadastre-se para fazer pedidos mais rápido
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
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Seu nome"
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">WhatsApp *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    value={formData.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    required
                                    disabled={isLoading}
                                    maxLength={15}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Apenas números com DDD
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3 text-sm text-purple-600">
                                    📍 Endereço de Entrega
                                </h4>
                                
                                <div className="grid gap-3">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="street">Rua</Label>
                                            <Input
                                                id="street"
                                                type="text"
                                                placeholder="Nome da rua"
                                                value={formData.street}
                                                onChange={(e) => updateField('street', e.target.value)}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="number">Número *</Label>
                                            <Input
                                                id="number"
                                                type="text"
                                                placeholder="123"
                                                value={formData.number}
                                                onChange={(e) => updateField('number', e.target.value)}
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="neighborhood">Bairro *</Label>
                                        <Input
                                            id="neighborhood"
                                            type="text"
                                            placeholder="Seu bairro"
                                            value={formData.neighborhood}
                                            onChange={(e) => updateField('neighborhood', e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">Cidade *</Label>
                                        <Input
                                            id="city"
                                            type="text"
                                            placeholder="Sua cidade"
                                            value={formData.city}
                                            onChange={(e) => updateField('city', e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reference">Ponto de Referência</Label>
                                        <Input
                                            id="reference"
                                            type="text"
                                            placeholder="Ex: Próximo à padaria, igreja..."
                                            value={formData.reference}
                                            onChange={(e) => updateField('reference', e.target.value)}
                                            disabled={isLoading}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Opcional - Ajuda o entregador a encontrar
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3 text-sm text-purple-600">
                                    🔐 Segurança
                                </h4>
                                
                                <div className="grid gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Senha *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Mínimo 6 caracteres"
                                            value={formData.password}
                                            onChange={(e) => updateField('password', e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Repita a senha"
                                            value={formData.confirmPassword}
                                            onChange={(e) => updateField('confirmPassword', e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Criar Conta
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-green-600 hover:underline">
                            Fazer login
                        </Link>
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                        Quer abrir uma loja?{' '}
                        <Link to="/cadastro-lojista" className="text-purple-600 hover:underline">
                            Cadastro para donos de loja
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
