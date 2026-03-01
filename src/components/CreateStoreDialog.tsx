import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { storesAPI, authAPI } from "@/services/api";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface CreateStoreDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStoreCreated: () => void;
}

export function CreateStoreDialog({ open, onOpenChange, onStoreCreated }: CreateStoreDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        whatsapp: '',
        primary_color: '#7c3aed',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validação das senhas
        if (formData.password !== formData.confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }
        
        if (formData.password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Criar usuário e fazer login automático
            const userResponse = await authAPI.register(formData.email, formData.password, formData.name);
            
            // 2. Salvar token e usuário no localStorage (auto-login)
            localStorage.setItem('token', userResponse.token);
            localStorage.setItem('user', JSON.stringify(userResponse.user));
            
            // 3. Criar loja associada ao usuário
            const storeResponse = await storesAPI.create({
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                whatsapp: formData.whatsapp,
                primary_color: formData.primary_color,
                owner_id: userResponse.user.id,
                delivery_fee: 0,
                min_order_value: 0,
                opening_time: '09:00:00',
                closing_time: '22:00:00',
            });
            
            onStoreCreated();
            setFormData({
                name: '',
                slug: '',
                description: '',
                whatsapp: '',
                primary_color: '#7c3aed',
                email: '',
                password: '',
                confirmPassword: '',
            });
            alert('✅ Loja criada com sucesso! Você já está logado.');
            onOpenChange(false);
            // Recarregar a página para atualizar o contexto de autenticação
            window.location.reload();
        } catch (error: any) {
            alert(error.message || 'Erro ao criar loja');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        setFormData({ ...formData, name, slug });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Criar Nova Loja</DialogTitle>
                    <DialogDescription>
                        Preencha as informações para criar sua loja de açaí e seus dados de acesso
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Dados da Loja */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-purple-600 border-b pb-2">🏪 Dados da Loja</h3>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome da Loja</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    placeholder="Ex: Açaí Express"
                                    required
                                />
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="slug">URL da Loja</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="acai-express"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Sua loja ficará em: prontacai.com/loja/{formData.slug || '...'}
                                </p>
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Descreva sua loja..."
                                    rows={3}
                                />
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <Input
                                    id="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    placeholder="(00) 00000-0000"
                                    required
                                />
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="color">Cor Principal</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="color"
                                        type="color"
                                        value={formData.primary_color}
                                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                                        className="w-20 h-10"
                                    />
                                    <Input
                                        value={formData.primary_color}
                                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                                        placeholder="#7c3aed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dados de Acesso */}
                        <div className="space-y-4 pt-4">
                            <h3 className="font-semibold text-purple-600 border-b pb-2">🔐 Dados de Acesso</h3>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="seu@email.com"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Use este e-mail para fazer login e acessar sua loja
                                </p>
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
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
                                    type={showPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="Repita a senha"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Criar Loja
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
