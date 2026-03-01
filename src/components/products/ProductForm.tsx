import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI, uploadAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface ProductFormProps {
    storeId: string;
    product?: any;
    onCancel: () => void;
    onSaved: () => void;
}

export function ProductForm({ storeId, product, onCancel, onSaved }: ProductFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        sizes: [] as string[],
        stock: -1,
        is_active: true,
        is_featured: false,
        preparation_time: 0,
        calories: 0,
    });

    useEffect(() => {
        loadCategories();
        
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                category_id: product.category_id || '',
                sizes: product.sizes || [],
                stock: product.stock ?? -1,
                is_active: product.is_active ?? true,
                is_featured: product.is_featured ?? false,
                preparation_time: product.preparation_time || 0,
                calories: product.calories || 0,
            });
            if (product.image_url) {
                setImagePreview(product.image_url);
            }
        }
    }, [product]);

    const loadCategories = async () => {
        try {
            const data = await categoriesAPI.getByStore(storeId);
            setCategories(data);
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSizeToggle = (size: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let image_url = product?.image_url || '';

            // Upload de imagem se houver
            if (imageFile) {
                const uploadResult = await uploadAPI.image(imageFile);
                image_url = uploadResult.url;
            }

            const productData = {
                ...formData,
                store_id: storeId,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock.toString()),
                preparation_time: parseInt(formData.preparation_time.toString()),
                calories: parseInt(formData.calories.toString()),
                image_url,
            };

            if (product) {
                await productsAPI.update(product.id, productData);
            } else {
                await productsAPI.create(productData);
            }

            onSaved();
        } catch (error: any) {
            alert(error.message || 'Erro ao salvar produto');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={onCancel}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h2 className="text-xl font-bold">
                            {product ? 'Editar Produto' : 'Novo Produto'}
                        </h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Imagem */}
                    <div className="space-y-2">
                        <Label>Imagem do Produto</Label>
                        <div className="flex items-center gap-4">
                            {imagePreview && (
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setImageFile(null);
                                        }}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <div className="flex-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    JPEG, PNG ou WebP (máx. 5MB)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Nome e Preço */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Açaí Tradicional"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Preço (R$) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0,00"
                                required
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descreva o produto..."
                            rows={3}
                        />
                    </div>

                    {/* Categoria */}
                    <div className="space-y-2">
                        <Label>Categoria</Label>
                        <Select
                            value={formData.category_id}
                            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tamanhos */}
                    <div className="space-y-2">
                        <Label>Tamanhos Disponíveis</Label>
                        <div className="flex flex-wrap gap-2">
                            {['300ml', '500ml', '700ml', '1L'].map((size) => (
                                <Button
                                    key={size}
                                    type="button"
                                    variant={formData.sizes.includes(size) ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleSizeToggle(size)}
                                >
                                    {size}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Estoque e Tempo */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="stock">Estoque (-1 = ilimitado)</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="preparation_time">Tempo de Preparo (min)</Label>
                            <Input
                                id="preparation_time"
                                type="number"
                                value={formData.preparation_time}
                                onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Opções */}
                    <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                            />
                            <Label htmlFor="is_active">Produto Ativo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_featured"
                                checked={formData.is_featured}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                            />
                            <Label htmlFor="is_featured">Destaque</Label>
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 justify-end pt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {product ? 'Atualizar' : 'Criar'} Produto
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
