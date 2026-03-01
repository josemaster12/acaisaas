import { useState, useEffect } from 'react';
import { X, Minus, Plus, Check } from 'lucide-react';
import { Product, ProductSize, Topping, CartItem } from '@/types';
import { toppings as allToppings, storeConfig } from '@/data/store';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductModal({ product, open, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedToppings([]);
      setQuantity(1);
      setNotes('');
    }
  }, [product]);

  if (!product) return null;

  const freeToppings = allToppings.filter(t => t.category === 'free');
  const paidToppings = allToppings.filter(t => t.category === 'paid');

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      }
      return [...prev, topping];
    });
  };

  const calculateTotal = () => {
    if (!selectedSize) return 0;
    const base = selectedSize.price;
    const paidTotal = selectedToppings
      .filter(t => t.category === 'paid')
      .reduce((sum, t) => sum + t.price, 0);
    const freeCount = selectedToppings.filter(t => t.category === 'free').length;
    const extraFreeCharge = Math.max(0, freeCount - storeConfig.freeToppingsLimit) * 1.50;
    return (base + paidTotal + extraFreeCharge) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    const item: CartItem = {
      id: '',
      product,
      selectedSize,
      toppings: selectedToppings,
      quantity,
      notes: notes || undefined,
    };
    
    addItem(item);
    toast.success('Adicionado ao carrinho!', {
      description: `${product.name} - ${selectedSize.size}`,
    });
    onClose();
  };

  const freeSelectedCount = selectedToppings.filter(t => t.category === 'free').length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/80 backdrop-blur rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
            <p className="text-muted-foreground">{product.description}</p>
          </DialogHeader>

          {/* Size Selection */}
          <div>
            <h4 className="font-semibold mb-3">Escolha o tamanho</h4>
            <div className="grid grid-cols-2 gap-2">
              {product.sizes.map(size => (
                <button
                  key={size.size}
                  onClick={() => setSelectedSize(size)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedSize?.size === size.size
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-bold">{size.size}</div>
                  <div className="text-sm text-muted-foreground">{size.ml}ml</div>
                  <div className="text-primary font-semibold">
                    R$ {size.price.toFixed(2).replace('.', ',')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Free Toppings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Adicionais Grátis</h4>
              <Badge variant="secondary">
                {freeSelectedCount}/{storeConfig.freeToppingsLimit} inclusos
              </Badge>
            </div>
            {freeSelectedCount > storeConfig.freeToppingsLimit && (
              <p className="text-sm text-secondary mb-2">
                +R$ 1,50 por adicional extra
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {freeToppings.map(topping => {
                const isSelected = selectedToppings.some(t => t.id === topping.id);
                return (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span>{topping.icon}</span>
                    <span className="text-sm font-medium">{topping.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paid Toppings */}
          <div>
            <h4 className="font-semibold mb-3">Adicionais Premium</h4>
            <div className="flex flex-wrap gap-2">
              {paidToppings.map(topping => {
                const isSelected = selectedToppings.some(t => t.id === topping.id);
                return (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-secondary bg-secondary/10'
                        : 'border-border hover:border-secondary/50'
                    }`}
                  >
                    <span>{topping.icon}</span>
                    <span className="text-sm font-medium">{topping.name}</span>
                    <span className="text-xs text-secondary font-semibold">
                      +R$ {topping.price.toFixed(2).replace('.', ',')}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-secondary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h4 className="font-semibold mb-3">Observações</h4>
            <Textarea
              placeholder="Ex: Sem banana, mais granola..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-3 bg-muted rounded-full p-1">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold w-8 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="flex-1 h-12 gradient-primary border-0 shadow-glow text-lg font-semibold"
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              Adicionar R$ {calculateTotal().toFixed(2).replace('.', ',')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
