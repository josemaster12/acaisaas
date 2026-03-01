import { useState, useEffect } from 'react';
import { ordersAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, XCircle, Package, Truck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface OrdersListProps {
    storeId: string;
}

const statusConfig: any = {
    pendente: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    em_preparo: { label: 'Em Preparo', color: 'bg-blue-100 text-blue-700', icon: Package },
    saiu_para_entrega: { label: 'Saiu para Entrega', color: 'bg-purple-100 text-purple-700', icon: Truck },
    entregue: { label: 'Entregue', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export function OrdersList({ storeId }: OrdersListProps) {
    const [orders, setOrders] = useState<any[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState('todos');

    useEffect(() => {
        loadOrders();
    }, [storeId]);

    useEffect(() => {
        if (statusFilter === 'todos') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(o => o.status === statusFilter));
        }
    }, [statusFilter, orders]);

    const loadOrders = async () => {
        try {
            const data = await ordersAPI.getByStore(storeId);
            setOrders(data);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, status: string) => {
        try {
            await ordersAPI.updateStatus(orderId, status);
            loadOrders();
            setSelectedOrder(null);
        } catch (error) {
            alert('Erro ao atualizar status');
        }
    };

    const formatStatus = (status: string) => {
        const config = statusConfig[status];
        const Icon = config?.icon || Clock;
        return (
            <Badge className={config?.color || 'bg-gray-100 text-gray-700'}>
                <Icon className="w-3 h-3 mr-1" />
                {config?.label || status}
            </Badge>
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return <div className="text-center py-8">Carregando pedidos...</div>;
    }

    return (
        <div className="space-y-4">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList>
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="pendente">Pendentes</TabsTrigger>
                    <TabsTrigger value="em_preparo">Em Preparo</TabsTrigger>
                    <TabsTrigger value="saiu_para_entrega">Saiu para Entrega</TabsTrigger>
                    <TabsTrigger value="entregue">Entregues</TabsTrigger>
                    <TabsTrigger value="cancelado">Cancelados</TabsTrigger>
                </TabsList>
            </Tabs>

            {filteredOrders.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredOrders.map((order) => (
                        <Card 
                            key={order.id} 
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setSelectedOrder(order)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold">#{order.id.slice(0, 8)}</span>
                                            {formatStatus(order.status)}
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Cliente:</span>
                                                <p className="font-medium">{order.customer_name}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Telefone:</span>
                                                <p className="font-medium">{order.customer_phone}</p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Total:</span>
                                                <p className="font-medium text-purple-600">
                                                    R$ {parseFloat(order.total).toFixed(2).replace('.', ',')}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Data:</span>
                                                <p className="font-medium">{formatDate(order.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Dialog de Detalhes do Pedido */}
            {selectedOrder && (
                <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                Pedido #{selectedOrder.id.slice(0, 8)}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Status:</span>
                                {formatStatus(selectedOrder.status)}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Cliente</p>
                                    <p className="font-medium">{selectedOrder.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Telefone</p>
                                    <p className="font-medium">{selectedOrder.customer_phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tipo de Entrega</p>
                                    <p className="font-medium">
                                        {selectedOrder.delivery_type === 'delivery' ? 'Delivery' : 'Retirada'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Pagamento</p>
                                    <p className="font-medium">{selectedOrder.payment_method}</p>
                                </div>
                            </div>

                            {selectedOrder.items && selectedOrder.items.length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Itens</p>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <div>
                                                    <p className="font-medium">
                                                        {item.quantity}x {item.product_name}
                                                    </p>
                                                    {item.size && (
                                                        <p className="text-sm text-muted-foreground">
                                                            Tamanho: {item.size}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="font-medium">
                                                    R$ {parseFloat(item.subtotal).toFixed(2).replace('.', ',')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-purple-600">
                                        R$ {parseFloat(selectedOrder.total).toFixed(2).replace('.', ',')}
                                    </span>
                                </div>
                            </div>

                            {selectedOrder.status === 'pendente' && (
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                        onClick={() => handleUpdateStatus(selectedOrder.id, 'em_preparo')}
                                    >
                                        Iniciar Preparo
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelado')}
                                    >
                                        Cancelar Pedido
                                    </Button>
                                </div>
                            )}

                            {selectedOrder.status === 'em_preparo' && (
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                                        onClick={() => handleUpdateStatus(selectedOrder.id, 'saiu_para_entrega')}
                                    >
                                        <Truck className="w-4 h-4 mr-2" />
                                        Saiu para Entrega
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelado')}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            )}

                            {selectedOrder.status === 'saiu_para_entrega' && (
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={() => handleUpdateStatus(selectedOrder.id, 'entregue')}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Marcar como Entregue
                                </Button>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
