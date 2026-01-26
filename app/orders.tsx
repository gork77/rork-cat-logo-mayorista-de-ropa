import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { Package, Calendar, ShoppingBag } from 'lucide-react-native';
import { useOrders } from '@/contexts/OrderContext';



export default function OrdersScreen() {
  const { orders } = useOrders();

  const renderOrder = ({ item }: { item: typeof orders[0] }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <View style={styles.orderIdContainer}>
            <Package size={16} color="#000" strokeWidth={1.5} />
            <Text style={styles.orderId}>Pedido {item.id}</Text>
          </View>
          <View style={styles.orderDateContainer}>
            <Calendar size={14} color="#666" strokeWidth={1.5} />
            <Text style={styles.orderDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.orderItem}>
            <Image 
              source={{ uri: orderItem.productImage }} 
              style={styles.orderItemImage} 
              contentFit="cover"
            />
            <View style={styles.orderItemDetails}>
              <Text style={styles.orderItemName} numberOfLines={1}>
                {orderItem.productName}
              </Text>
              <Text style={styles.orderItemInfo}>
                Talla: {orderItem.size}{orderItem.color ? ` · ${orderItem.color}` : ''} · Cant: {orderItem.quantity}
              </Text>
              <Text style={styles.orderItemPrice}>
                {(orderItem.price * orderItem.quantity).toFixed(2)}€
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>{item.total.toFixed(2)}€</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Pedidos Anteriores',
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#000',
          headerShadowVisible: false,
        }} 
      />
      
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={80} color="#dee2e6" strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>No hay pedidos aún</Text>
          <Text style={styles.emptyText}>Tus pedidos confirmados aparecerán aquí</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  content: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    gap: 6,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#000',
    letterSpacing: 0.2,
  },
  orderDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    letterSpacing: 0.1,
  },
  statusBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: '#000',
    letterSpacing: 0.3,
  },
  itemsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    gap: 12,
  },
  orderItemImage: {
    width: 60,
    height: 80,
    backgroundColor: '#f8f9fa',
  },
  orderItemDetails: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  orderItemName: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#000',
    letterSpacing: 0.2,
  },
  orderItemInfo: {
    fontSize: 11,
    color: '#666',
    letterSpacing: 0.2,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#000',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#666',
    letterSpacing: 0.3,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#000',
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
});
