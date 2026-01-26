import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Tag, ShoppingBag, ChevronRight, LogOut } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { userInfo } = useUser();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <User size={48} color="#666" strokeWidth={1.5} />
        </View>
        <Text style={styles.userName}>{userInfo.name}</Text>
        <Text style={styles.userEmail}>{userInfo.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MI CUENTA</Text>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          activeOpacity={0.7}
          onPress={() => router.push('/personal-info')}
        >
          <View style={styles.menuIconContainer}>
            <User size={20} color="#000" strokeWidth={1.5} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Información Personal</Text>
            <Text style={styles.menuSubtitle}>Edita tu perfil y datos</Text>
          </View>
          <ChevronRight size={20} color="#999" strokeWidth={1.5} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          activeOpacity={0.7}
          onPress={() => router.push('/discounts')}
        >
          <View style={styles.menuIconContainer}>
            <Tag size={20} color="#000" strokeWidth={1.5} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Descuentos Especiales</Text>
            <Text style={styles.menuSubtitle}>Consulta tus ofertas exclusivas</Text>
          </View>
          <ChevronRight size={20} color="#999" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>COMPRAS</Text>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          activeOpacity={0.7}
          onPress={() => router.push('/orders')}
        >
          <View style={styles.menuIconContainer}>
            <ShoppingBag size={20} color="#000" strokeWidth={1.5} />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Pedidos Anteriores</Text>
            <Text style={styles.menuSubtitle}>Historial de compras</Text>
          </View>
          <ChevronRight size={20} color="#999" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <View style={styles.discountCard}>
        <View style={styles.discountIconContainer}>
          <Tag size={24} color="#fff" strokeWidth={2} />
        </View>
        <View style={styles.discountContent}>
          <Text style={styles.discountTitle}>Descuento Mayorista</Text>
          <Text style={styles.discountDescription}>
            Obtén 15% de descuento en pedidos superiores a 500€
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8}>
        <LogOut size={18} color="#d32f2f" strokeWidth={2} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
    letterSpacing: 0.2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#999',
    marginBottom: 12,
    letterSpacing: 1.2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#000',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#999',
    letterSpacing: 0.1,
  },
  discountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 0,
    marginBottom: 32,
  },
  discountIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  discountDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: '#d32f2f',
    letterSpacing: 0.2,
  },
});
