import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { storesAPI, authAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Shield, Store, TrendingUp, Package, ShoppingBag, DollarSign,
    Plus, Eye, EyeOff, Trash2, AlertCircle, CheckCircle2, RefreshCw, Key, ExternalLink, LogIn
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Store {
    id: string;
    name: string;
    slug: string;
    owner_id: string;
    is_active: boolean;
    created_at: string;
    primary_color?: string;
    logo_url?: string;
    plan_name?: string;
    max_products?: number;
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);
    const [storeForPassword, setStoreForPassword] = useState<Store | null>(null);
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>('');
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: '',
        showPassword: false,
    });
    const [passwordError, setPasswordError] = useState<string>('');

    useEffect(() => {
        loadAllStores();
    }, []);

    const loadAllStores = async () => {
        try {
            setIsLoading(true);
            setDebugInfo('Carregando lojas...');
            console.log('[AdminDashboard] Carregando todas as lojas...');
            const data = await storesAPI.getAllStores();
            console.log('[AdminDashboard] Lojas carregadas:', data);
            setStores(data);
            setDebugInfo(`Carregadas ${data.length} loja(s)`);
        } catch (error: any) {
            console.error('Erro ao carregar lojas:', error);
            setDebugInfo(`Erro: ${error.message}`);
            alert('Erro ao carregar lojas: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStoreStatus = async (store: Store) => {
        try {
            setIsActionLoading(store.id);
            if (store.is_active) {
                await storesAPI.deactivate(store.id);
                alert('Loja desativada com sucesso');
            } else {
                await storesAPI.activate(store.id);
                alert('Loja ativada com sucesso');
            }
            loadAllStores();
        } catch (error: any) {
            alert(error.message || 'Erro ao alterar status da loja');
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleDeleteStore = async () => {
        if (!storeToDelete) return;

        try {
            setIsActionLoading(storeToDelete.id);
            await storesAPI.delete(storeToDelete.id);
            alert('Loja excluída com sucesso');
            loadAllStores();
        } catch (error: any) {
            alert(error.message || 'Erro ao excluir loja');
        } finally {
            setIsActionLoading(null);
            setStoreToDelete(null);
        }
    };

    const handleChangePassword = (store: Store) => {
        setStoreForPassword(store);
        setPasswordData({ newPassword: '', confirmPassword: '', showPassword: false });
        setPasswordError('');
    };

    const handleSubmitPassword = async () => {
        if (!storeForPassword) return;

        // Validações
        if (passwordData.newPassword.length < 6) {
            setPasswordError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('As senhas não coincidem');
            return;
        }

        try {
            setIsActionLoading(`password-${storeForPassword.id}`);
            await authAPI.changePassword(storeForPassword.owner_id, passwordData.newPassword);
            alert('Senha alterada com sucesso!');
            setStoreForPassword(null);
            setPasswordData({ newPassword: '', confirmPassword: '', showPassword: false });
            setPasswordError('');
        } catch (error: any) {
            setPasswordError(error.message || 'Erro ao alterar senha');
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleLoginAsOwner = (store: Store) => {
        navigate(`/dashboard/loja/${store.id}`);
    };

    const stats = {
        total: stores.length,
        active: stores.filter(s => s.is_active).length,
        inactive: stores.filter(s => !s.is_active).length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Painel Administrativo</h1>
                                <p className="text-sm text-muted-foreground">
                                    {user?.email} • Administrador Global
                                </p>
                                {debugInfo && (
                                    <Badge variant="outline" className="mt-1 text-xs">
                                        {debugInfo}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                                title="Limpar localStorage e recarregar"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/dashboard')}>
                                Ver Meu Dashboard
                            </Button>
                            <Button variant="outline" onClick={() => { logout(); navigate('/login'); }}>
                                Sair
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Conteúdo Principal */}
            <main className="container mx-auto px-4 py-8">
                {/* Debug Info */}
                <Card className="mb-6 bg-yellow-50 border-yellow-200">
                    <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium text-yellow-800">
                            🔍 Debug Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                        <div className="grid gap-2 text-xs font-mono">
                            <div>
                                <strong>User:</strong> {user?.email} | Role: {user?.role || 'N/A'}
                            </div>
                            <div>
                                <strong>Lojas carregadas:</strong> {stores.length}
                            </div>
                            <div>
                                <strong>LocalStorage mock-stores:</strong>{' '}
                                {localStorage.getItem('mock-stores') ? 'EXISTS' : 'NOT FOUND'}
                            </div>
                            {stores.length > 0 && (
                                <div>
                                    <strong>Lojas:</strong>{' '}
                                    {stores.map(s => `${s.name} (owner: ${s.owner_id})`).join(', ')}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Lojas</CardTitle>
                            <Store className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">Lojas cadastradas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lojas Ativas</CardTitle>
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
                            <p className="text-xs text-muted-foreground">Operando normalmente</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Lojas Inativas</CardTitle>
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600">{stats.inactive}</div>
                            <p className="text-xs text-muted-foreground">Desativadas ou pendentes</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Título e Filtro */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Todas as Lojas</h2>
                        <p className="text-muted-foreground">Gerencie todas as lojas cadastradas na plataforma</p>
                    </div>
                </div>

                {/* Lista de Lojas */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Carregando lojas...</p>
                    </div>
                ) : stores.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Nenhuma loja cadastrada</CardTitle>
                            <CardDescription>
                                Ainda não há lojas na plataforma
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={loadAllStores} variant="outline">
                                Recarregar Lojas
                            </Button>
                            <p className="text-xs text-muted-foreground mt-4">
                                Debug: Total de lojas = {stores.length}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {stores.map((store) => (
                            <Card key={store.id} className={`${!store.is_active ? 'bg-gray-100' : ''}`}>
                                <CardContent className="py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            {store.logo_url ? (
                                                <img
                                                    src={store.logo_url}
                                                    alt={store.name}
                                                    className="w-14 h-14 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="w-14 h-14 rounded-full flex items-center justify-center"
                                                    style={{ backgroundColor: store.primary_color || '#8B5CF6' }}
                                                >
                                                    <Store className="w-7 h-7 text-white" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg">{store.name}</h3>
                                                    {store.is_active ? (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                                            Ativa
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                                                            Inativa
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {store.slug} • Criada em {new Date(store.created_at).toLocaleDateString('pt-BR')}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Owner: {store.owner_id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleLoginAsOwner(store)}
                                                title="Acessar painel da loja"
                                            >
                                                <LogIn className="w-4 h-4 mr-1" />
                                                Painel
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(`/loja/${store.slug}`, '_blank')}
                                                title="Abrir site da loja em nova aba"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                Site
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleChangePassword(store)}
                                                title="Alterar senha do lojista"
                                            >
                                                <Key className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant={store.is_active ? "outline" : "default"}
                                                size="sm"
                                                onClick={() => handleToggleStoreStatus(store)}
                                                disabled={isActionLoading === store.id}
                                                className={store.is_active ? "text-orange-600 hover:text-orange-700" : "text-green-600"}
                                            >
                                                {store.is_active ? (
                                                    <>
                                                        <EyeOff className="w-4 h-4 mr-1" />
                                                        Desativar
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        Ativar
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setStoreToDelete(store)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Dialog de Confirmação para Excluir */}
            <AlertDialog open={!!storeToDelete} onOpenChange={() => setStoreToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Loja</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir a loja "{storeToDelete?.name}"?
                            <br />
                            <span className="text-red-600 font-semibold">
                                Esta ação não pode ser desfeita e todos os dados da loja serão perdidos.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteStore}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isActionLoading === storeToDelete?.id}
                        >
                            {isActionLoading === storeToDelete?.id ? 'Excluindo...' : 'Excluir'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Dialog para Alterar Senha */}
            <Dialog open={!!storeForPassword} onOpenChange={() => {
                setStoreForPassword(null);
                setPasswordData({ newPassword: '', confirmPassword: '', showPassword: false });
                setPasswordError('');
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Alterar Senha</DialogTitle>
                        <DialogDescription>
                            Alterar senha do lojista da loja "{storeForPassword?.name}"
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {passwordError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                                {passwordError}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={passwordData.showPassword ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="Mínimo 6 caracteres"
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setPasswordData({ ...passwordData, showPassword: !passwordData.showPassword })}
                                >
                                    {passwordData.showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <Input
                                id="confirmPassword"
                                type={passwordData.showPassword ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                placeholder="Repita a nova senha"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setStoreForPassword(null);
                                setPasswordData({ newPassword: '', confirmPassword: '', showPassword: false });
                                setPasswordError('');
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmitPassword}
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={isActionLoading === `password-${storeForPassword?.id}`}
                        >
                            {isActionLoading === `password-${storeForPassword?.id}` ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Alterando...
                                </>
                            ) : (
                                'Alterar Senha'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
