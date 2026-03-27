import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Tag, Package, TrendingUp, Award } from 'lucide-react-native';

interface Discount {
  id: string;
  title: string;
  description: string;
  icon: typeof Tag;
  color: string;
}

const DISCOUNTS: Discount[] = [
  {
    id: '1',
    title: '20% de Descuento',
    description: 'Al comprar 100 prendas iguales',
    icon: Package,
    color: '#000',
  },
  {
    id: '2',
    title: '15% de Descuento',
    description: 'En pedidos superiores a 1.000€',
    icon: TrendingUp,
    color: '#2d2d2d',
  },
  {
    id: '3',
    title: '10% de Descuento',
    description: 'En tu primer pedido mayorista',
    icon: Award,
    color: '#4a4a4a',
  },
  {
    id: '4',
    title: '5% de Descuento',
    description: 'En pedidos superiores a 500€',
    icon: Tag,
    color: '#666',
  },
];

export default function DiscountsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Descuentos Especiales',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerShadowVisible: false,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tus Descuentos Exclusivos</Text>
          <Text style={styles.headerSubtitle}>
            Los descuentos no son acumulables entre sí
          </Text>
        </View>

        {DISCOUNTS.map((discount, index) => {
          const Icon = discount.icon;
          return (
            <View key={discount.id} style={styles.discountCard}>
              <View style={[styles.iconContainer, { backgroundColor: discount.color }]}>
                <Icon size={28} color="#fff" strokeWidth={2} />
              </View>
              <View style={styles.discountContent}>
                <Text style={styles.discountTitle}>{discount.title}</Text>
                <Text style={styles.discountDescription}>{discount.description}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>#{index + 1}</Text>
              </View>
            </View>
          );
        })}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>⚠️ Importante</Text>
          <Text style={styles.infoText}>
            • Los descuentos no son acumulables{'\n'}
            • Se aplicará automáticamente el descuento más favorable{'\n'}
            • Válido solo para pedidos mayoristas{'\n'}
            • Consulta condiciones específicas con tu asesor comercial
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    letterSpacing: 0.2,
  },
  discountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
    borderRadius: 0,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  discountContent: {
    flex: 1,
  },
  discountTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  discountDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
    borderRadius: 0,
    borderLeftWidth: 3,
    borderLeftColor: '#000',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
});
