import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react-native';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { useOrders } from '@/contexts/OrderContext';
import { trpc } from '@/lib/trpc';
import * as Haptics from 'expo-haptics';

export default function CartScreen() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { userInfo } = useUser();
  const { addOrder } = useOrders();
  
  const sendEmailMutation = trpc.email.sendOrderNotification.useMutation();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    try {
      const order = await addOrder(
        items,
        getTotalPrice(),
        userInfo.name,
        userInfo.email,
        userInfo.address
      );
      
      try {
        await sendEmailMutation.mutateAsync({
          orderId: order.id,
          customerName: userInfo.name,
          customerEmail: userInfo.email,
          customerPhone: userInfo.phone,
          address: userInfo.address,
          items: order.items.map(item => ({
            productName: item.productName,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
          })),
          total: order.total,
        });
        console.log('Email de notificación enviado correctamente');
      } catch (emailError) {
        console.log('Error al enviar email de notificación:', emailError);
      }
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Pedido Confirmado',
        `Pedido ${order.id}\nTotal: ${getTotalPrice().toFixed(2)}€\n\nTiempo de entrega estimado: 3-5 días laborables`,
        [
          {
            text: 'Continuar Comprando',
            style: 'cancel',
            onPress: () => clearCart(),
          },
          {
            text: 'Ver Pedidos',
            onPress: () => clearCart(),
          },
        ]
      );
    } catch (error) {
      console.log('Error al procesar pedido:', error);
      Alert.alert('Error', 'No se pudo procesar el pedido. Intenta de nuevo.');
    }
  };

  const handleRemove = (productId: string, selectedSize: string, selectedColor?: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    removeFromCart(productId, selectedSize, selectedColor);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number, selectedSize: string, selectedColor?: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateQuantity(productId, newQuantity, selectedSize, selectedColor);
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ShoppingBag size={80} color="#dee2e6" strokeWidth={1.5} />
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptyText}>Añade productos para comenzar tu pedido</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {items.map((item, index) => (
          <View key={`${item.product.id}-${item.selectedSize}-${item.selectedColor || 'default'}-${index}`} style={styles.cartItem}>
            <Image 
              source={{ uri: item.product.image }} 
              style={styles.itemImage} 
              contentFit="cover"
            />
            <View style={styles.itemDetails}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
                <TouchableOpacity 
                  onPress={() => handleRemove(item.product.id, item.selectedSize, item.selectedColor)}
                  style={styles.deleteButton}
                  activeOpacity={0.7}
                >
                  <Trash2 size={18} color="#868e96" />
                </TouchableOpacity>
              </View>
              <View style={styles.itemOptions}>
                <Text style={styles.itemOption}>Talla: {item.selectedSize}</Text>
                {item.selectedColor && (
                  <View style={styles.colorInfo}>
                    <Text style={styles.itemOption}>Color: </Text>
                    <View style={[styles.colorDot, { backgroundColor: item.selectedColor }]} />
                  </View>
                )}
              </View>
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>{(item.product.price || 0).toFixed(2)}€</Text>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleUpdateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                    activeOpacity={0.7}
                  >
                    <Minus size={16} color="#1a1a1a" strokeWidth={2.5} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity || 1}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleUpdateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                    activeOpacity={0.7}
                  >
                    <Plus size={16} color="#1a1a1a" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.itemSubtotal}>
                Subtotal: {((item.product.price || 0) * (item.quantity || 1)).toFixed(2)}€
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{(getTotalPrice() || 0).toFixed(2)}€</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fafafa',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#000',
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 0,
    marginBottom: 1,
    overflow: 'hidden',
  },
  itemImage: {
    width: 100,
    height: 140,
    backgroundColor: '#f8f9fa',
  },
  itemDetails: {
    flex: 1,
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#2d2d2d',
    marginRight: 8,
    letterSpacing: 0.2,
  },
  deleteButton: {
    padding: 4,
  },
  itemOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  itemOption: {
    fontSize: 11,
    color: '#666',
    letterSpacing: 0.2,
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#000',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#000',
    minWidth: 32,
    textAlign: 'center',
  },
  itemSubtotal: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#666',
    letterSpacing: 0.1,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 20,
    paddingBottom: 32,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#666',
    letterSpacing: 0.5,
  },
  totalPrice: {
    fontSize: 26,
    fontWeight: '600' as const,
    color: '#000',
  },
  checkoutButton: {
    backgroundColor: '#000',
    borderRadius: 0,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#fff',
    letterSpacing: 1.5,
  },
});
