import { useState, useEffect } from 'react';
import { productsAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, EyeOff, DollarSign } from 'lucide-react';
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

interface ProductListProps {
    storeId: string;
    onEdit: (product: any) => void;
    onRefresh: () => void;
}

export function ProductList({ storeId, onEdit, onRefresh }: ProductListProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
    }, [storeId]);

    const loadProducts = async () => {
        try {
            const data = await productsAPI.getByStore(storeId);
            setProducts(data.products || data);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActive = async (product: any) => {
        try {
            await productsAPI.update(product.id, { is_active: !product.is_active });
            loadProducts();
            onRefresh();
        } catch (error) {
            alert('Erro ao atualizar produto');
        }
    };

    const handleDelete = async () => {
        if (!productToDelete) return;
        
        try {
            await productsAPI.delete(productToDelete);
            loadProducts();
            onRefresh();
        } catch (error) {
            alert('Erro ao excluir produto');
        } finally {
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const confirmDelete = (productId: string) => {
        setProductToDelete(productId);
        setDeleteDialogOpen(true);
    };

    if (isLoading) {
        return <div className="text-center py-8">Carregando produtos...</div>;
    }

    if (products.length === 0) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">Nenhum produto cadastrado</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Clique em "Novo Produto" para começar
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
                <Card key={product.id} className="relative overflow-hidden">
                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 bg-white/80 hover:bg-white"
                            onClick={() => handleToggleActive(product)}
                        >
                            {product.is_active ? (
                                <Eye className="w-4 h-4" />
                            ) : (
                                <EyeOff className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                    
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-40 object-cover"
                        />
                    ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                            <span className="text-4xl">🍧</span>
                        </div>
                    )}
                    
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                    {product.is_active ? 'Ativo' : 'Inativo'}
                                </Badge>
                                {product.is_featured && (
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                        ⭐ Destaque
                                    </Badge>
                                )}
                            </div>
                            
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {product.description}
                            </p>
                            
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center text-purple-600 font-bold">
                                    <DollarSign className="w-4 h-4" />
                                    {parseFloat(product.price).toFixed(2).replace('.', ',')}
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onEdit(product)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => confirmDelete(product.id)}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
