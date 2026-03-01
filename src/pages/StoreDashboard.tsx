import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { storesAPI, productsAPI, ordersAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    ArrowLeft, Package, ShoppingBag, Settings, TrendingUp, 
    Plus, Edit, Trash2, Eye, EyeOff 
} from 'lucide-react';
import { ProductList } from '@/components/products/ProductList';
import { ProductForm } from '@/components/products/ProductForm';
import { OrdersList } from '@/components/orders/OrdersList';
import { StoreSettings } from '@/components/settings/StoreSettings';

export default function StoreDashboard() {
    const { storeId } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [store, setStore] = useState<any>(null);
    const [dashboard, setDashboard] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('products');
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (storeId) {
            loadDashboard();
        }
    }, [storeId]);

    const loadDashboard = async () => {
        try {
            const [storeData, dashboardData] = await Promise.all([
                storesAPI.getById(storeId!),
                storesAPI.getDashboard(storeId!),
            ]);
            setStore(storeData);
            setDashboard(dashboardData);
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        setShowProductForm(true);
    };

    const handleProductSaved = () => {
        setShowProductForm(false);
        setEditingProduct(null);
        loadDashboard();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => navigate('/dashboard')}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div className="flex items-center space-x-3">
                                {store?.logo_url ? (
                                    <img 
                                        src={store.logo_url} 
                                        alt={store.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div 
                                        className="w-10 h-10 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: store?.primary_color }}
                                    >
                                        <Package className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div>
                                    <h1 className="font-bold">{store?.name}</h1>
                                    <p className="text-xs text-muted-foreground">
                                        {dashboard?.stats?.totalProducts || 0} produtos • 
                                        {dashboard?.stats?.pendingOrders || 0} pedidos pendentes
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => window.open(`/loja/${store?.slug}`, '_blank')}>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Loja
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/login'); }}>
                                Sair
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            {dashboard && (
                <div className="container mx-auto px-4 py-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Produtos</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboard.stats.totalProducts}</div>
                                <p className="text-xs text-muted-foreground">Cadastrados</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboard.stats.pendingOrders}</div>
                                <p className="text-xs text-muted-foreground">Aguardando</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pedidos em Preparo</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboard.stats.preparingOrders}</div>
                                <p className="text-xs text-muted-foreground">Preparando</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Receita (30d)</CardTitle>
                                <span className="text-lg">💰</span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    R$ {dashboard.stats.revenue30d?.toFixed(2) || '0,00'}
                                </div>
                                <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <main className="container mx-auto px-4 pb-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="products">
                            <Package className="w-4 h-4 mr-2" />
                            Produtos
                        </TabsTrigger>
                        <TabsTrigger value="orders">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Pedidos
                        </TabsTrigger>
                        <TabsTrigger value="settings">
                            <Settings className="w-4 h-4 mr-2" />
                            Configurações
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="products" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Gerenciar Produtos</h2>
                            <Button 
                                onClick={() => setShowProductForm(true)}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Produto
                            </Button>
                        </div>
                        
                        {showProductForm ? (
                            <ProductForm 
                                storeId={storeId!}
                                product={editingProduct}
                                onCancel={() => {
                                    setShowProductForm(false);
                                    setEditingProduct(null);
                                }}
                                onSaved={handleProductSaved}
                            />
                        ) : (
                            <ProductList 
                                storeId={storeId!}
                                onEdit={handleEditProduct}
                                onRefresh={loadDashboard}
                            />
                        )}
                    </TabsContent>

                    <TabsContent value="orders" className="space-y-4">
                        <h2 className="text-xl font-bold">Gerenciar Pedidos</h2>
                        <OrdersList storeId={storeId!} />
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                        <h2 className="text-xl font-bold">Configurações da Loja</h2>
                        <StoreSettings store={store} onUpdate={loadDashboard} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
