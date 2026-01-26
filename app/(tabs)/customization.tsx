import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { Sparkles, Shirt, Palette, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CustomizationScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Sparkles size={48} color="#000" strokeWidth={1.5} />
          </View>
        </View>
        
        <Text style={styles.title}>PERSONALIZACIÓN DTF</Text>
        <Text style={styles.subtitle}>Estampa tus diseños favoritos en cualquier prenda</Text>
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Shirt size={32} color="#000" strokeWidth={1.5} />
          </View>
          <Text style={styles.cardTitle}>Cualquier Prenda</Text>
          <Text style={styles.cardDescription}>
            Personaliza camisetas, sudaderas, chaquetas y más con tu diseño único
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Palette size={32} color="#000" strokeWidth={1.5} />
          </View>
          <Text style={styles.cardTitle}>Diseños Ilimitados</Text>
          <Text style={styles.cardDescription}>
            Desde logos personalizados hasta ilustraciones complejas y fotografías
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Zap size={32} color="#000" strokeWidth={1.5} />
          </View>
          <Text style={styles.cardTitle}>Alta Calidad</Text>
          <Text style={styles.cardDescription}>
            Tecnología DTF de última generación con colores vibrantes y duraderos
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>¿Qué es DTF?</Text>
        <Text style={styles.infoText}>
          Direct to Film (DTF) es la técnica más avanzada de estampación textil. Permite transferir 
          diseños de alta resolución con colores brillantes y detalles precisos sobre cualquier tipo 
          de tejido, garantizando durabilidad excepcional lavado tras lavado.
        </Text>
      </View>

      <View style={styles.comingSoonBanner}>
        <View style={styles.bannerContent}>
          <Sparkles size={24} color="#fff" strokeWidth={2} />
          <Text style={styles.bannerText}>PRÓXIMAMENTE</Text>
        </View>
        <Text style={styles.bannerSubtext}>
          Estamos preparando nuestra plataforma de personalización. 
          Pronto podrás diseñar y estampar tus prendas directamente desde aquí.
        </Text>
      </View>
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
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#000',
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: '#666',
    letterSpacing: 0.3,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#000',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: '#666',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#000',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: '#555',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  comingSoonBanner: {
    backgroundColor: '#000',
    padding: 32,
    alignItems: 'center',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  bannerText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
    letterSpacing: 3,
  },
  bannerSubtext: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.3,
    maxWidth: 320,
  },
});
