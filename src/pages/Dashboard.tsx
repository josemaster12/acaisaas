import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { storesAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Store, TrendingUp, Package, ShoppingBag, DollarSign } from 'lucide-react';
import { CreateStoreDialog } from '@/components/CreateStoreDialog';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [stores, setStores] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        try {
            const isAdmin = user?.role === 'admin';
            const data = await storesAPI.getAll(user?.id, isAdmin);
            
            // Se for admin, não filtra (admin não tem lojas próprias aqui)
            // Se for lojista, filtra apenas lojas do usuário
            const userStores = isAdmin ? [] : data.filter((store: any) => store.owner_id === user?.id);
            
            setStores(userStores);
            
            // Se tiver apenas uma loja, redirecionar diretamente para o dashboard da loja
            if (!isAdmin && userStores.length === 1) {
                navigate(`/dashboard/loja/${userStores[0].id}`);
            }
        } catch (error) {
            console.error('Erro ao carregar lojas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateStore = () => {
        setIsCreateDialogOpen(true);
    };

    const handleStoreCreated = () => {
        setIsCreateDialogOpen(false);
        loadStores();
    };

    const handleOpenStore = (storeId: string) => {
        navigate(`/dashboard/loja/${storeId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Pronto Açaí Now</h1>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" onClick={() => { logout(); navigate('/login'); }}>
                                Sair
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold">Minhas Lojas</h2>
                        <p className="text-muted-foreground">Gerencie suas lojas de açaí</p>
                    </div>
                    <Button 
                        onClick={handleCreateStore}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Loja
                    </Button>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Carregando lojas...</p>
                    </div>
                ) : stores.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Nenhuma loja cadastrada</CardTitle>
                            <CardDescription>
                                Crie sua primeira loja para começar a vender
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={handleCreateStore}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Criar Minha Loja
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {stores.map((store) => (
                            <Card 
                                key={store.id} 
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleOpenStore(store.id)}
                            >
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        {store.logo_url ? (
                                            <img 
                                                src={store.logo_url} 
                                                alt={store.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div 
                                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: store.primary_color }}
                                            >
                                                <Store className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                        <div>
                                            <CardTitle>{store.name}</CardTitle>
                                            <CardDescription>{store.plan_name || 'Gratuito'}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <Package className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                                            <p className="text-xs text-muted-foreground">Produtos</p>
                                            <p className="font-semibold">{store.max_products || 10}</p>
                                        </div>
                                        <div>
                                            <ShoppingBag className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                                            <p className="text-xs text-muted-foreground">Pedidos</p>
                                            <p className="font-semibold">0</p>
                                        </div>
                                        <div>
                                            <DollarSign className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                                            <p className="text-xs text-muted-foreground">Receita</p>
                                            <p className="font-semibold">R$ 0</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <CreateStoreDialog 
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onStoreCreated={handleStoreCreated}
            />
        </div>
    );
}
