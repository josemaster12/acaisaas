import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag, Tag } from 'lucide-react';
import { Header } from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { storeConfig } from '@/data/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Cart = () => {
  const {
    items,
    removeItem,
    updateItem,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    coupon,
    setCoupon,
    discount,
  } = useCart();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();
  const meetsMinOrder = subtotal >= storeConfig.minOrder;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <div className="text-8xl mb-6 animate-float">🛒</div>
          <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground mb-6">
            Adicione deliciosos açaís ao seu pedido!
          </p>
          <Link to="/cardapio">
            <Button className="gap-2 gradient-primary border-0 shadow-glow">
              <ShoppingBag className="h-5 w-5" />
              Ver Cardápio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />
      
      <div className="container py-6">
        <Link to="/cardapio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </Link>

        <h1 className="text-3xl font-bold mb-6">Meu Carrinho</h1>

        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-card rounded-2xl p-4 shadow-card animate-scale-in">
              <div className="flex gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.selectedSize.size} ({item.selectedSize.ml}ml)
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {item.toppings.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.toppings.map(topping => (
                        <span
                          key={topping.id}
                          className="text-xs px-2 py-1 rounded-full bg-muted"
                        >
                          {topping.icon} {topping.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Obs: {item.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-muted rounded-full p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => updateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-bold w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="font-bold text-primary">
                      R$ {(item.selectedSize.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon */}
        <div className="mt-6 p-4 bg-card rounded-2xl shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-5 w-5 text-secondary" />
            <span className="font-semibold">Cupom de desconto</span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Digite seu cupom"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="uppercase"
            />
            {discount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/20 text-accent">
                <span className="font-semibold">-{discount}%</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Cupons disponíveis: ACAI10, PRIMEIRA
          </p>
        </div>

        {/* Order Summary */}
        <div className="mt-6 p-4 bg-card rounded-2xl shadow-card">
          <h3 className="font-semibold mb-4">Resumo do pedido</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-secondary">
                <span>Desconto ({discount}%)</span>
                <span>-R$ {((subtotal * discount) / 100).toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxa de entrega</span>
              <span>
                {meetsMinOrder 
                  ? `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`
                  : `Mín. R$ ${storeConfig.minOrder.toFixed(2).replace('.', ',')}`
                }
              </span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <div className="container">
          {!meetsMinOrder && (
            <p className="text-center text-sm text-secondary mb-3">
              Faltam R$ {(storeConfig.minOrder - subtotal).toFixed(2).replace('.', ',')} para o pedido mínimo
            </p>
          )}
          <Link to={meetsMinOrder ? "/checkout" : "#"}>
            <Button
              className="w-full h-14 text-lg font-semibold gradient-primary border-0 shadow-glow"
              disabled={!meetsMinOrder}
            >
              Finalizar Pedido
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
