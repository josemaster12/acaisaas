import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
    Loader2, User, LogOut, Award, Gift, ShoppingBag, 
    ChevronRight, Star, Trophy, Package
} from 'lucide-react';
import { customerAPI, storesAPI } from '@/services/api';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: {
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        reference: string;
    };
}

interface LoyaltyProgram {
    enabled: boolean;
    points: number;
    maxPoints: number;
    rewardDescription: string;
}

interface Order {
    id: string;
    store_name: string;
    total: number;
    points_earned: number;
    status: 'pendente' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado';
    created_at: string;
    estimated_time?: string;
}

export default function CustomerProfile() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram>({
        enabled: false,
        points: 0,
        maxPoints: 10,
        rewardDescription: 'Ganhe 1 açaí grátis após 10 compras!',
    });
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCustomerData();
    }, []);

    const loadCustomerData = async () => {
        try {
            // Carregar dados do localStorage
            const storedCustomer = localStorage.getItem('customer');
            const storedToken = localStorage.getItem('customer_token');

            if (!storedCustomer || !storedToken) {
                navigate('/login');
                return;
            }

            const customerData = JSON.parse(storedCustomer);
            setCustomer(customerData);

            // Carregar programa de fidelidade
            const storedLoyalty = localStorage.getItem(`loyalty-${customerData.id}`);
            if (storedLoyalty) {
                setLoyaltyProgram(JSON.parse(storedLoyalty));
            }

            // Carregar pedidos (mock)
            const storedOrders = localStorage.getItem(`orders-${customerData.id}`);
            if (storedOrders) {
                setOrders(JSON.parse(storedOrders));
            }
        } catch (err: any) {
            setError('Erro ao carregar dados');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('customer');
        localStorage.removeItem('customer_token');
        navigate('/');
    };

    const canRedeem = loyaltyProgram.points >= loyaltyProgram.maxPoints;

    const handleRedeemReward = async () => {
        if (!canRedeem || !customer) return;

        if (!window.confirm('Deseja resgatar 1 açaí grátis?')) return;

        try {
            setIsLoading(true);
            
            // Reduzir pontos
            const newPoints = loyaltyProgram.points - loyaltyProgram.maxPoints;
            const newLoyalty = { ...loyaltyProgram, points: newPoints };
            
            localStorage.setItem(`loyalty-${customer.id}`, JSON.stringify(newLoyalty));
            setLoyaltyProgram(newLoyalty);

            // Criar cupom de resgate
            const coupon = `ACAI-GRATIS-${Date.now().toString().slice(-6)}`;
            localStorage.setItem(`coupon-${customer.id}`, JSON.stringify({
                code: coupon,
                discount: 100, // 100% de desconto
                used: false,
                created_at: new Date().toISOString(),
            }));

            alert(`✅ Resgate realizado com sucesso!\n\nUse o cupom: ${coupon}\n\nVálido por 7 dias.`);
        } catch (err: any) {
            alert('Erro ao resgatar prêmio');
        } finally {
            setIsLoading(false);
        }
    };

    if (!customer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                <User className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Minha Conta</h1>
                                <p className="text-sm text-muted-foreground">{customer.email}</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair
                        </Button>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Cards de Stats */}
                    <div className="grid gap-4 md:grid-cols-3 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pontos</CardTitle>
                                <Award className="h-5 w-5 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-purple-600">
                                    {loyaltyProgram.points}/{loyaltyProgram.maxPoints}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {loyaltyProgram.points < loyaltyProgram.maxPoints 
                                        ? `Faltam ${loyaltyProgram.maxPoints - loyaltyProgram.points} para prêmio`
                                        : 'Prêmio disponível!'}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                                <ShoppingBag className="h-5 w-5 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{orders.length}</div>
                                <p className="text-xs text-muted-foreground">Total de pedidos</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Prêmios</CardTitle>
                                <Gift className="h-5 w-5 text-pink-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-pink-600">
                                    {canRedeem ? '🎁' : '🔒'}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {canRedeem ? 'Disponível para resgate' : 'Em breve'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="loyalty" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="loyalty">
                                <Award className="w-4 h-4 mr-2" />
                                Fidelidade
                            </TabsTrigger>
                            <TabsTrigger value="orders">
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Pedidos
                            </TabsTrigger>
                            <TabsTrigger value="profile">
                                <User className="w-4 h-4 mr-2" />
                                Perfil
                            </TabsTrigger>
                        </TabsList>

                        {/* Tab Fidelidade */}
                        <TabsContent value="loyalty" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="w-6 h-6 text-purple-600" />
                                        Programa de Fidelidade
                                    </CardTitle>
                                    <CardDescription>
                                        {loyaltyProgram.rewardDescription}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Barra de Progresso */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">Seu progresso:</span>
                                            <span className="text-purple-600 font-bold">
                                                {loyaltyProgram.points} de {loyaltyProgram.maxPoints} pontos
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min((loyaltyProgram.points / loyaltyProgram.maxPoints) * 100, 100)}%` }}
                                            />
                                        </div>
                                        {loyaltyProgram.points > 0 && (
                                            <div className="flex gap-1 flex-wrap">
                                                {Array.from({ length: loyaltyProgram.maxPoints }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-6 h-6 ${
                                                            i < loyaltyProgram.points
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Como Ganhar Pontos */}
                                    <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                                        <h3 className="font-semibold text-purple-800">Como ganhar pontos:</h3>
                                        <ul className="text-sm text-purple-700 space-y-1">
                                            <li>✅ 1 ponto a cada pedido finalizado</li>
                                            <li>🎁 10 pontos = 1 açaí grátis</li>
                                            <li>⏰ Pontos não expiram</li>
                                        </ul>
                                    </div>

                                    {/* Botão de Resgate */}
                                    {canRedeem ? (
                                        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Gift className="w-8 h-8 text-green-600" />
                                                <div>
                                                    <h3 className="font-bold text-green-800">Prêmio Disponível!</h3>
                                                    <p className="text-sm text-green-700">
                                                        Você completou 10 pontos e ganhou 1 açaí grátis!
                                                    </p>
                                                </div>
                                            </div>
                                            <Button 
                                                onClick={handleRedeemReward}
                                                disabled={isLoading}
                                                className="w-full bg-green-600 hover:bg-green-700"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Processando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Gift className="w-4 h-4 mr-2" />
                                                        Resgatar Prêmio Agora
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <Package className="w-8 h-8 text-gray-400" />
                                                <div>
                                                    <h3 className="font-bold text-gray-600">Falta pouco!</h3>
                                                    <p className="text-sm text-gray-500">
                                                        Mais {loyaltyProgram.maxPoints - loyaltyProgram.points} pedido(s) para ganhar um prêmio
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Pedidos */}
                        <TabsContent value="orders" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Meus Pedidos</CardTitle>
                                    <CardDescription>
                                        Histórico de todos os seus pedidos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {orders.length === 0 ? (
                                        <div className="text-center py-8">
                                            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                            <p className="text-muted-foreground">Você ainda não fez nenhum pedido</p>
                                            <Button 
                                                className="mt-4"
                                                onClick={() => navigate('/')}
                                            >
                                                Fazer Primeiro Pedido
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {orders.map((order) => {
                                                const getStatusInfo = (status: string) => {
                                                    switch (status) {
                                                        case 'pendente':
                                                            return { color: 'bg-yellow-100 text-yellow-700', icon: '⏳', label: 'Pendente' };
                                                        case 'em_preparo':
                                                            return { color: 'bg-blue-100 text-blue-700', icon: '👨‍🍳', label: 'Em Preparo' };
                                                        case 'saiu_para_entrega':
                                                            return { color: 'bg-purple-100 text-purple-700', icon: '🛵', label: 'Saiu para Entrega' };
                                                        case 'entregue':
                                                            return { color: 'bg-green-100 text-green-700', icon: '✅', label: 'Entregue' };
                                                        case 'cancelado':
                                                            return { color: 'bg-red-100 text-red-700', icon: '❌', label: 'Cancelado' };
                                                        default:
                                                            return { color: 'bg-gray-100 text-gray-700', icon: '📋', label: status };
                                                    }
                                                };

                                                const statusInfo = getStatusInfo(order.status);

                                                return (
                                                    <Card key={order.id}>
                                                        <CardContent className="py-4">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <h4 className="font-semibold">{order.store_name}</h4>
                                                                        <Badge className={statusInfo.color}>
                                                                            {statusInfo.icon} {statusInfo.label}
                                                                        </Badge>
                                                                    </div>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                                                        {order.estimated_time && (
                                                                            <span className="ml-2">
                                                                                • ⏱️ {order.estimated_time}
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="text-sm font-medium">
                                                                            R$ {order.total.toFixed(2)}
                                                                            {order.points_earned > 0 && (
                                                                                <span className="ml-2 text-purple-600">
                                                                                    (+{order.points_earned} ponto{order.points_earned > 1 ? 's' : ''})
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                        {order.status === 'saiu_para_entrega' && order.estimated_time && (
                                                                            <p className="text-xs text-purple-600 mt-1">
                                                                                🛵 Previsão de entrega: {order.estimated_time}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Perfil */}
                        <TabsContent value="profile" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dados do Perfil</CardTitle>
                                    <CardDescription>
                                        Suas informações cadastrais
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label>Nome</Label>
                                        <Input value={customer.name} disabled />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>E-mail</Label>
                                        <Input value={customer.email} type="email" disabled />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>WhatsApp</Label>
                                        <Input value={customer.phone} disabled />
                                    </div>
                                    
                                    {customer.address && (
                                        <div className="border-t pt-4 mt-4">
                                            <h4 className="font-semibold mb-3 text-sm text-purple-600">
                                                📍 Endereço Cadastrado
                                            </h4>
                                            <div className="grid gap-3">
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="col-span-2">
                                                        <Label>Rua</Label>
                                                        <Input value={customer.address.street || 'Não informado'} disabled />
                                                    </div>
                                                    <div>
                                                        <Label>Número</Label>
                                                        <Input value={customer.address.number || 'S/N'} disabled />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label>Bairro</Label>
                                                    <Input value={customer.address.neighborhood || 'Não informado'} disabled />
                                                </div>
                                                <div>
                                                    <Label>Cidade</Label>
                                                    <Input value={customer.address.city || 'Não informado'} disabled />
                                                </div>
                                                <div>
                                                    <Label>Ponto de Referência</Label>
                                                    <Input value={customer.address.reference || 'Não informado'} disabled />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <p className="text-xs text-muted-foreground">
                                        Para alterar seus dados, entre em contato com o suporte.
                                    </p>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
