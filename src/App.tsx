import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { MockModeBanner } from "@/components/MockModeBanner";
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerProfile from "./pages/CustomerProfile";
import RecoverPassword from "./pages/RecoverPassword";
import Dashboard from "./pages/Dashboard";
import StoreDashboard from "./pages/StoreDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DebugPage from "./pages/DebugPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <MockModeBanner />
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/cardapio" element={<Menu />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/loja/:slug" element={<Index />} />

              {/* Autenticação */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<CustomerRegister />} />
              <Route path="/cadastro-lojista" element={<Register />} />
              <Route path="/recuperar-senha" element={<RecoverPassword />} />

              {/* Cliente */}
              <Route path="/meu-perfil" element={<CustomerProfile />} />

              {/* Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/loja/:storeId" element={<StoreDashboard />} />
              
              {/* Admin */}
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Debug */}
              <Route path="/debug" element={<DebugPage />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
