import { useState } from 'react';
import { storesAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Loader2, Store, Award, Gift } from 'lucide-react';

interface StoreSettingsProps {
    store: any;
    onUpdate: () => void;
}

export function StoreSettings({ store, onUpdate }: StoreSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: store?.name || '',
        slug: store?.slug || '',
        description: store?.description || '',
        whatsapp: store?.whatsapp || '',
        primary_color: store?.primary_color || '#7c3aed',
        delivery_fee: store?.delivery_fee?.toString() || '0',
        min_order_value: store?.min_order_value?.toString() || '0',
        opening_time: store?.opening_time?.slice(0, 5) || '09:00',
        closing_time: store?.closing_time?.slice(0, 5) || '22:00',
        is_active: store?.is_active ?? true,
        loyalty_enabled: store?.loyalty_enabled ?? false,
        loyalty_points: store?.loyalty_points || 10,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await storesAPI.update(store.id, {
                ...formData,
                delivery_fee: parseFloat(formData.delivery_fee),
                min_order_value: parseFloat(formData.min_order_value),
                opening_time: formData.opening_time + ':00',
                closing_time: formData.closing_time + ':00',
            });
            onUpdate();
            alert('Configurações salvas com sucesso!');
        } catch (error: any) {
            alert(error.message || 'Erro ao salvar configurações');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Informações da Loja</CardTitle>
                    <CardDescription>
                        Atualize os dados principais da sua loja
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome da Loja *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">URL (Slug) *</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="sua-loja"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    URL pública: /loja/{formData.slug}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp *</Label>
                                <Input
                                    id="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    placeholder="(00) 00000-0000"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="primary_color">Cor Principal</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="primary_color"
                                        type="color"
                                        value={formData.primary_color}
                                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                                        className="w-20 h-10"
                                    />
                                    <Input
                                        value={formData.primary_color}
                                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="loyalty_enabled"
                                    checked={formData.loyalty_enabled}
                                    onCheckedChange={(checked) => setFormData({ ...formData, loyalty_enabled: checked })}
                                />
                                <Label htmlFor="loyalty_enabled" className="font-semibold text-purple-600">
                                    Programa de Fidelidade
                                </Label>
                            </div>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-purple-600" />
                                    <h4 className="font-semibold text-purple-800">Configurar Fidelidade</h4>
                                </div>
                                <p className="text-sm text-purple-700">
                                    Ative para que seus clientes ganhem pontos a cada compra!
                                </p>
                                <div className="grid gap-2">
                                    <Label htmlFor="loyalty_points">Pontos para prêmio</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="loyalty_points"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={formData.loyalty_points}
                                            onChange={(e) => setFormData({ ...formData, loyalty_points: parseInt(e.target.value) || 10 })}
                                            className="w-24"
                                            disabled={!formData.loyalty_enabled}
                                        />
                                        <span className="text-sm text-purple-700">
                                            compras = 1 açaí grátis
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-purple-700">
                                    <Gift className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <p>
                                        Quando ativado, cada pedido finalizado marca automaticamente 1 ponto para o cliente.
                                        Ao completar {formData.loyalty_points} pontos, o cliente ganha 1 açaí grátis!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                            />
                            <Label htmlFor="is_active">Loja Ativa (visível ao público)</Label>
                        </div>

                        <Button 
                            type="submit" 
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Configurações
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Horário de Funcionamento</CardTitle>
                    <CardDescription>
                        Defina quando sua loja está aberta
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="opening_time">Horário de Abertura</Label>
                        <Input
                            id="opening_time"
                            type="time"
                            value={formData.opening_time}
                            onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="closing_time">Horário de Fechamento</Label>
                        <Input
                            id="closing_time"
                            type="time"
                            value={formData.closing_time}
                            onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Taxas e Pedidos</CardTitle>
                    <CardDescription>
                        Configure taxas de entrega e valor mínimo
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="delivery_fee">Taxa de Entrega (R$)</Label>
                        <Input
                            id="delivery_fee"
                            type="number"
                            step="0.01"
                            value={formData.delivery_fee}
                            onChange={(e) => setFormData({ ...formData, delivery_fee: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="min_order_value">Valor Mínimo do Pedido (R$)</Label>
                        <Input
                            id="min_order_value"
                            type="number"
                            step="0.01"
                            value={formData.min_order_value}
                            onChange={(e) => setFormData({ ...formData, min_order_value: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
