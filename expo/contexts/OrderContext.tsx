import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '@/types/product';

const BULK_DISCOUNT_THRESHOLD = 50;
const BULK_DISCOUNT_RATE = 0.1;

const getOrderItemUnitPrice = (item: CartItem): number => {
  const basePrice = item.product.price || 0;
  return item.quantity >= BULK_DISCOUNT_THRESHOLD ? basePrice * (1 - BULK_DISCOUNT_RATE) : basePrice;
};

export type OrderItem = {
  productName: string;
  productImage: string;
  quantity: number;
  size: string;
  color?: string;
  price: number;
};

export type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: string;
  customerName: string;
  email: string;
  address: string;
};

export const [OrderProvider, useOrders] = createContextHook(() => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const stored = await AsyncStorage.getItem('orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading orders:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const addOrder = async (
    items: CartItem[], 
    total: number, 
    customerName: string, 
    email: string, 
    address: string
  ) => {
    const newOrder: Order = {
      id: `#${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      items: items.map(item => ({
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        price: getOrderItemUnitPrice(item),
      })),
      total,
      status: 'Confirmado',
      customerName,
      email,
      address,
    };

    try {
      const updatedOrders = [newOrder, ...orders];
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      return newOrder;
    } catch (error) {
      console.log('Error saving order:', error);
      throw error;
    }
  };

  return {
    orders,
    addOrder,
    isLoaded,
  };
});
