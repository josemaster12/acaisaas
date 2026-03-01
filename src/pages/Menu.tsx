import { useState } from 'react';
import { Header } from '@/components/Header';
import { CategoryTabs } from '@/components/CategoryTabs';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { FloatingCart } from '@/components/FloatingCart';
import { products, categories } from '@/data/store';
import { Product } from '@/types';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Cardápio</h1>
          <p className="text-muted-foreground">Escolha seu açaí favorito 🍇</p>
        </div>

        <div className="sticky top-16 z-40 bg-background py-4 -mx-4 px-4">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍇</div>
            <p className="text-muted-foreground">Nenhum produto nesta categoria ainda</p>
          </div>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      
      <FloatingCart />
    </div>
  );
};

export default Menu;
