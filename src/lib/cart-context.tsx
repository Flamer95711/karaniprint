'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCartItems,
  type CartItem,
} from '@/app/actions/cart';

// ═══════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════
type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  loading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

// ═══════════════════════════════════════════════
// Provider
// ═══════════════════════════════════════════════
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    try {
      const data = await getCartItems();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (productId: number, quantity: number) => {
    const result = await addCartItem(productId, quantity);
    if (result.success) {
      await refreshCart();
    }
  }, [refreshCart]);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeCartItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      return;
    }
    // Optimistic update
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, quantity } : item)
    );
    await updateCartItem(id, quantity);
  }, []);

  const removeItem = useCallback(async (id: string) => {
    // Optimistic remove
    setItems(prev => prev.filter(item => item.id !== id));
    await removeCartItem(id);
  }, []);

  const clearCart = useCallback(async () => {
    setItems([]);
    await clearCartItems();
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ═══════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
