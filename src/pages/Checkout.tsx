import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CreditCard, Banknote, QrCode } from 'lucide-react';
import { Header } from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { storeConfig } from '@/data/store';
import { CustomerInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'pix', label: 'Pix', icon: QrCode },
  { id: 'dinheiro', label: 'Dinheiro', icon: Banknote },
  { id: 'cartao', label: 'Cartão na entrega', icon: CreditCard },
] as const;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, customerInfo, setCustomerInfo, clearCart, discount } = useCart();
  
  // Carregar dados do cliente logado
  const [customerData, setCustomerData] = useState<any>(null);
  
  useEffect(() => {
    const storedCustomer = localStorage.getItem('customer');
    if (storedCustomer) {
      const customer = JSON.parse(storedCustomer);
      setCustomerData(customer);
    }
  }, []);
  
  const [formData, setFormData] = useState<CustomerInfo>(customerInfo || {
    name: customerData?.name || '',
    phone: customerData?.phone || '',
    address: customerData?.address?.street 
      ? `${customerData.address.street}, ${customerData.address.number}`
      : '',
    reference: customerData?.address?.reference || '',
    paymentMethod: 'pix',
    change: '',
  });
  const [loading, setLoading] = useState(false);

  const total = getTotal();

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatWhatsAppMessage = () => {
    const itemsList = items.map(item => {
      const toppingsStr = item.toppings.length > 0
        ? `\n   Adicionais: ${item.toppings.map(t => t.name).join(', ')}`
        : '';
      const notesStr = item.notes ? `\n   Obs: ${item.notes}` : '';
      return `• ${item.quantity}x ${item.product.name} (${item.selectedSize.size})${toppingsStr}${notesStr}`;
    }).join('\n');

    const paymentLabel = paymentMethods.find(p => p.id === formData.paymentMethod)?.label || formData.paymentMethod;
    const changeInfo = formData.paymentMethod === 'dinheiro' && formData.change
      ? `\nTroco para: R$ ${formData.change}`
      : '';

    const discountInfo = discount > 0 ? `\n🎟️ Desconto: ${discount}%` : '';

    // Verificar se cliente tem endereço cadastrado
    const storedCustomer = localStorage.getItem('customer');
    let customerAddress = formData.address;
    let customerPhone = formData.phone;
    let customerName = formData.name;
    
    if (storedCustomer) {
      const customer = JSON.parse(storedCustomer);
      customerName = customer.name || formData.name;
      customerPhone = customer.phone || formData.phone;
      if (customer.address) {
        customerAddress = `${customer.address.street}, ${customer.address.number} - ${customer.address.neighborhood}, ${customer.address.city}`;
      }
    }

    const addressInfo = `
📍 *Endereço de Entrega:*
   Rua: ${customer.address || (customer.address?.street ? customer.address.street : formData.address)}
   Número: ${customer.address?.number || 'S/N'}
   Bairro: ${customer.address?.neighborhood || ''}
   Cidade: ${customer.address?.city || ''}
   🚩 Referência: ${customer.address?.reference || formData.reference || 'Não informado'}`;

    return encodeURIComponent(
`🍇 *Novo Pedido - ${storeConfig.name}*

👤 *Cliente:* ${customerName}
📱 *WhatsApp:* ${customerPhone}
${addressInfo}

📝 *Pedido:*
${itemsList}
${discountInfo}

💰 *Total:* R$ ${total.toFixed(2).replace('.', ',')}

💳 *Pagamento:* ${paymentLabel}${changeInfo}

---
_Pedido feito pelo Açaí Express_`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast.error('Preencha nome e telefone');
      return;
    }

    setLoading(true);
    setCustomerInfo(formData);

    // Verificar se cliente está logado e se loja tem fidelidade ativo
    const storedCustomer = localStorage.getItem('customer');
    const storedStore = localStorage.getItem('store_config');
    
    if (storedCustomer && storedStore) {
      try {
        const customer = JSON.parse(storedCustomer);
        const store = JSON.parse(storedStore);
        
        // Verificar se programa de fidelidade está ativo
        if (store.loyalty_enabled) {
          // Carregar pontos atuais do cliente
          const storedLoyalty = localStorage.getItem(`loyalty-${customer.id}`);
          let loyalty = storedLoyalty 
            ? JSON.parse(storedLoyalty)
            : { enabled: true, points: 0, maxPoints: store.loyalty_points || 10, rewardDescription: 'Ganhe 1 açaí grátis!' };
          
          // Adicionar 1 ponto
          loyalty.points = (loyalty.points || 0) + 1;
          
          // Salvar novos pontos
          localStorage.setItem(`loyalty-${customer.id}`, JSON.stringify(loyalty));
          
          // Salvar pedido no histórico do cliente
          const storedOrders = localStorage.getItem(`orders-${customer.id}`);
          const orders = storedOrders ? JSON.parse(storedOrders) : [];
          orders.unshift({
            id: `order-${Date.now()}`,
            store_name: store.name,
            total: getTotal(),
            points_earned: 1,
            status: 'pendente', // Pedido começa como pendente
            created_at: new Date().toISOString(),
            estimated_time: store.estimatedTime || '30-45 min',
          });
          localStorage.setItem(`orders-${customer.id}`, JSON.stringify(orders));
          
          // Mostrar notificação de pontos ganhos
          if (loyalty.points >= loyalty.maxPoints) {
            toast.success(`🎉 Parabéns! Você ganhou 1 ponto e completou ${loyalty.points} pontos! Resgate seu prêmio em /meu-perfil`);
          } else {
            toast.success(`✅ Pedido enviado! Você ganhou +1 ponto (${loyalty.points}/${loyalty.maxPoints})`);
          }
        }
      } catch (err) {
        console.error('Erro ao salvar pontos:', err);
      }
    }

    const message = formatWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${storeConfig.whatsapp}?text=${message}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      clearCart();
      toast.success('Pedido enviado com sucesso!');
      navigate('/');
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
          <Link to="/cardapio">
            <Button className="gradient-primary border-0 mt-4">
              Ver Cardápio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <Header />
      
      <div className="container py-6">
        <Link to="/carrinho" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao carrinho
        </Link>

        <h1 className="text-3xl font-bold mb-6">Finalizar Pedido</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info */}
          <div className="bg-card rounded-2xl p-6 shadow-card space-y-4">
            <h2 className="font-semibold text-lg mb-4">📍 Endereço de Entrega</h2>
            
            {customerData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  ✅ <strong>Endereço cadastrado:</strong> {customerData.address?.street}, {customerData.address?.number} - {customerData.address?.neighborhood}, {customerData.address?.city}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  🚩 Referência: {customerData.address?.reference || 'Não informado'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="street">Rua *</Label>
                <Input
                  id="street"
                  placeholder="Nome da rua"
                  value={formData.address?.split(',')[0] || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  placeholder="123"
                  value={formData.address?.split(',')[1]?.trim() || ''}
                  onChange={(e) => handleChange('address', `${formData.address?.split(',')[0] || ''}, ${e.target.value}`)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                placeholder="Seu bairro"
                value={customerData?.address?.neighborhood || ''}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                placeholder="Sua cidade"
                value={customerData?.address?.city || ''}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Ponto de Referência</Label>
              <Input
                id="reference"
                placeholder="Ex: Próximo à padaria, igreja..."
                value={formData.reference}
                onChange={(e) => handleChange('reference', e.target.value)}
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card space-y-4">
            <h2 className="font-semibold text-lg mb-4">👤 Seus Dados</h2>

            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone / WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h2 className="font-semibold text-lg mb-4">Forma de Pagamento</h2>
            
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => handleChange('paymentMethod', method.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    formData.paymentMethod === method.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <method.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{method.label}</span>
                </button>
              ))}
            </div>

            {formData.paymentMethod === 'dinheiro' && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="change">Troco para quanto?</Label>
                <Input
                  id="change"
                  type="number"
                  placeholder="Ex: 50"
                  value={formData.change}
                  onChange={(e) => handleChange('change', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h2 className="font-semibold text-lg mb-4">Resumo</h2>
            
            <div className="space-y-2 text-sm">
              {items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {item.quantity}x {item.product.name} ({item.selectedSize.size})
                  </span>
                  <span>R$ {(item.selectedSize.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-lg font-semibold gradient-primary border-0 shadow-glow gap-2"
          >
            <Send className="h-5 w-5" />
            Enviar Pedido via WhatsApp
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Ao clicar, seu pedido será enviado diretamente para nosso WhatsApp
          </p>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
