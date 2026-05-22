import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback } from 'react';
import { Product, CartItem } from '@/types/product';

const BULK_DISCOUNT_THRESHOLD = 50;
const BULK_DISCOUNT_RATE = 0.1;

const getDiscountedUnitPrice = (item: CartItem): number => {
  const basePrice = item.product.price || 0;
  return item.quantity >= BULK_DISCOUNT_THRESHOLD ? basePrice * (1 - BULK_DISCOUNT_RATE) : basePrice;
};

export const [CartProvider, useCart] = createContextHook(() => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity: number = 1, selectedSize: string, selectedColor?: string) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => 
          item.product.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
      );
      
      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...currentItems, { product, quantity, selectedSize, selectedColor }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, selectedSize: string, selectedColor?: string) => {
    setItems((currentItems) => currentItems.filter(
      (item) => !(item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, selectedSize: string, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }
    
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
          ? { ...item, quantity } 
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + getDiscountedUnitPrice(item) * item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getDiscountedUnitPrice,
    bulkDiscountThreshold: BULK_DISCOUNT_THRESHOLD,
    bulkDiscountRate: BULK_DISCOUNT_RATE,
  };
});
