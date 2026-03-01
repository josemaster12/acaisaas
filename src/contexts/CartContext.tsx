import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CustomerInfo } from '@/types';
import { storeConfig } from '@/data/store';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;
  coupon: string;
  setCoupon: (code: string) => void;
  discount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('acai-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(() => {
    const saved = localStorage.getItem('acai-customer');
    return saved ? JSON.parse(saved) : null;
  });
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem('acai-cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (customerInfo) {
      localStorage.setItem('acai-customer', JSON.stringify(customerInfo));
    }
  }, [customerInfo]);

  useEffect(() => {
    // Simple coupon validation
    if (coupon.toUpperCase() === 'ACAI10') {
      setDiscount(10);
    } else if (coupon.toUpperCase() === 'PRIMEIRA') {
      setDiscount(15);
    } else {
      setDiscount(0);
    }
  }, [coupon]);

  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('acai-cart');
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => {
      const basePrice = item.selectedSize.price;
      const toppingsPrice = item.toppings
        .filter(t => t.category === 'paid')
        .reduce((sum, t) => sum + t.price, 0);
      const freeCount = item.toppings.filter(t => t.category === 'free').length;
      const extraFreeCharge = Math.max(0, freeCount - storeConfig.freeToppingsLimit) * 1.50;
      return total + ((basePrice + toppingsPrice + extraFreeCharge) * item.quantity);
    }, 0);
  };

  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    return subtotal >= storeConfig.minOrder ? storeConfig.deliveryFee : 0;
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const delivery = getDeliveryFee();
    const discountAmount = (subtotal * discount) / 100;
    return subtotal + delivery - discountAmount;
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateItem,
      clearCart,
      getSubtotal,
      getDeliveryFee,
      getTotal,
      getItemCount,
      customerInfo,
      setCustomerInfo,
      coupon,
      setCoupon,
      discount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
