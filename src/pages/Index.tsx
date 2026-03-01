import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Truck } from 'lucide-react';
import { Header } from '@/components/Header';
import { StoreStatus } from '@/components/StoreStatus';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { FloatingCart } from '@/components/FloatingCart';
import { Button } from '@/components/ui/button';
import { products, storeConfig } from '@/data/store';
import { Product } from '@/types';
import heroBanner from '@/assets/hero-banner.jpg';

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        
        <div className="relative container py-16 md:py-24">
          <div className="max-w-xl">
            <StoreStatus />
            
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight">
              O melhor açaí
              <br />
              <span className="opacity-90">da região!</span>
            </h1>
            
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-md">
              Açaí cremoso, frutas frescas e adicionais especiais. 
              Monte o seu do jeito que você ama! 🍇
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/cardapio">
                <Button size="lg" className="h-14 px-8 bg-card text-primary hover:bg-card/90 shadow-lg gap-2 text-lg font-semibold">
                  Fazer Pedido
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Info Cards */}
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary-foreground/10 backdrop-blur text-primary-foreground">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">{storeConfig.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary-foreground/10 backdrop-blur text-primary-foreground">
                <Truck className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Taxa: R$ {storeConfig.deliveryFee.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary-foreground/10 backdrop-blur text-primary-foreground">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium">Entrega na sua casa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">⭐ Destaques</h2>
            <p className="text-muted-foreground mt-1">Os mais pedidos da casa</p>
          </div>
          <Link to="/cardapio">
            <Button variant="ghost" className="gap-2 text-primary">
              Ver tudo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted/50">
        <div className="container py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              🍇 Por que escolher o Açaí Express?
            </h2>
            <p className="text-muted-foreground mb-8">
              Trabalhamos apenas com açaí de qualidade premium, direto do Pará. 
              Nossos adicionais são sempre frescos e preparados com carinho.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card shadow-card">
                <div className="text-4xl mb-3">🥇</div>
                <h3 className="font-bold mb-2">Qualidade Premium</h3>
                <p className="text-sm text-muted-foreground">Açaí puro e cremoso, sem adição de corantes</p>
              </div>
              <div className="p-6 rounded-2xl bg-card shadow-card">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-bold mb-2">Entrega Rápida</h3>
                <p className="text-sm text-muted-foreground">Seu pedido chega quentinho (ou geladinho!)</p>
              </div>
              <div className="p-6 rounded-2xl bg-card shadow-card">
                <div className="text-4xl mb-3">💜</div>
                <h3 className="font-bold mb-2">Feito com Amor</h3>
                <p className="text-sm text-muted-foreground">Cada pedido é preparado especialmente pra você</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-12 text-center">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
              Pronto para pedir?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
              Monte seu açaí personalizado e receba em casa rapidinho!
            </p>
            <Link to="/cardapio">
              <Button size="lg" className="h-14 px-8 bg-card text-primary hover:bg-card/90 shadow-lg gap-2 text-lg font-semibold">
                Ver Cardápio Completo
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="absolute -right-10 -bottom-10 text-[200px] opacity-10">
            🍇
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍇</span>
              <span className="text-xl font-bold text-gradient">Açaí Express</span>
            </div>
            <div className="text-center md:text-right text-sm text-muted-foreground">
              <p>Horário: {storeConfig.openHour}h às {storeConfig.closeHour}h</p>
              <p className="mt-1">Pedido mínimo: R$ {storeConfig.minOrder.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
        </div>
      </footer>

      <ProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      
      <FloatingCart />
    </div>
  );
};

export default Index;
