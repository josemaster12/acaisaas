import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

export function FloatingCart() {
  const { getItemCount, getTotal } = useCart();
  const itemCount = getItemCount();

  if (itemCount === 0) return null;

  return (
    <Link to="/carrinho" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <Button className="h-14 px-6 rounded-full gradient-primary border-0 shadow-glow gap-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
            {itemCount}
          </span>
        </div>
        <div className="h-6 w-px bg-white/30" />
        <span className="font-bold">
          R$ {getTotal().toFixed(2).replace('.', ',')}
        </span>
      </Button>
    </Link>
  );
}
