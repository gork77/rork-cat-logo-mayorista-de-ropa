import { useState, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Sparkles, Shirt, Palette, Zap, ChevronDown, Brush, Users, Upload, Tag, Star, Flame } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DTFOption {
  id: string;
  name: string;
  size: string;
  originalPrice: number;
  price: number;
  discount: number;
  popular?: boolean;
  limited?: boolean;
}

interface DTFSection {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  options: DTFOption[];
}

const dtfSections: DTFSection[] = [
  {
    id: 'nuestros-disenos',
    title: 'Nuestros Diseños',
    subtitle: 'Colección exclusiva de estampados premium listos para transferir',
    icon: <Brush size={22} color="#000" strokeWidth={1.8} />,
    badge: 'HOT',
    badgeColor: '#E53935',
    options: [
      { id: 'nd-1', name: 'Estampado Logo Clásico', size: 'A4', originalPrice: 14.99, price: 8.99, discount: 40, popular: true },
      { id: 'nd-2', name: 'Diseño Abstract Art', size: 'A4', originalPrice: 16.99, price: 9.99, discount: 41 },
      { id: 'nd-3', name: 'Estampado Streetwear', size: 'A3', originalPrice: 22.99, price: 13.99, discount: 39, popular: true },
      { id: 'nd-4', name: 'Diseño Minimal Line', size: 'A5', originalPrice: 11.99, price: 5.99, discount: 50, limited: true },
      { id: 'nd-5', name: 'Pack 3 Diseños (A4)', size: 'A4 x3', originalPrice: 44.97, price: 22.99, discount: 49 },
    ],
  },
  {
    id: 'colaboraciones',
    title: 'Colaboraciones con Artistas',
    subtitle: 'Ediciones limitadas creadas por artistas locales e internacionales',
    icon: <Users size={22} color="#000" strokeWidth={1.8} />,
    badge: 'LIMITED',
    badgeColor: '#FF8F00',
    options: [
      { id: 'ca-1', name: 'Collab × @inkrebel', size: 'A4', originalPrice: 24.99, price: 16.99, discount: 32, limited: true },
      { id: 'ca-2', name: 'Collab × Studio Noir', size: 'A3', originalPrice: 29.99, price: 19.99, discount: 33, popular: true },
      { id: 'ca-3', name: 'Collab × Mura Arts', size: 'A4', originalPrice: 22.99, price: 14.99, discount: 35, limited: true },
      { id: 'ca-4', name: 'Pack Artista (2 diseños)', size: 'A4 x2', originalPrice: 44.98, price: 27.99, discount: 38 },
    ],
  },
  {
    id: 'tus-disenos',
    title: 'Tus Diseños',
    subtitle: 'Sube tu imagen y la convertimos en un DTF profesional',
    icon: <Upload size={22} color="#000" strokeWidth={1.8} />,
    badge: '-50%',
    badgeColor: '#00897B',
    options: [
      { id: 'td-1', name: 'DTF Personalizado', size: 'A5', originalPrice: 12.99, price: 6.99, discount: 46 },
      { id: 'td-2', name: 'DTF Personalizado', size: 'A4', originalPrice: 18.99, price: 9.99, discount: 47, popular: true },
      { id: 'td-3', name: 'DTF Personalizado', size: 'A3', originalPrice: 26.99, price: 14.99, discount: 44 },
      { id: 'td-4', name: 'Pack 5 DTF Personalizados', size: 'A4 x5', originalPrice: 89.95, price: 39.99, discount: 56, limited: true },
    ],
  },
];

function AccordionSection({ section }: { section: DTFSection }) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = useCallback(() => {
    const toValue = expanded ? 0 : 1;
    Animated.parallel([
      Animated.spring(animatedHeight, {
        toValue,
        useNativeDriver: false,
        friction: 10,
        tension: 80,
      }),
      Animated.timing(rotateAnim, {
        toValue,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
    setExpanded(!expanded);
  }, [expanded, animatedHeight, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, section.options.length * 120 + 60],
  });

  const opacity = animatedHeight.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.3, 1],
  });

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggle}
        style={[styles.accordionHeader, expanded && styles.accordionHeaderExpanded]}
      >
        <View style={styles.accordionHeaderLeft}>
          <View style={styles.accordionIcon}>{section.icon}</View>
          <View style={styles.accordionTitleGroup}>
            <View style={styles.accordionTitleRow}>
              <Text style={styles.accordionTitle}>{section.title}</Text>
              {section.badge && (
                <View style={[styles.sectionBadge, { backgroundColor: section.badgeColor }]}>
                  <Text style={styles.sectionBadgeText}>{section.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.accordionSubtitle} numberOfLines={2}>{section.subtitle}</Text>
          </View>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <ChevronDown size={22} color="#000" strokeWidth={2} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.accordionBody, { maxHeight, opacity }]}>
        <View style={styles.optionsList}>
          {section.options.map((option) => (
            <View key={option.id} style={styles.optionCard}>
              <View style={styles.optionTop}>
                <View style={styles.optionInfo}>
                  <View style={styles.optionNameRow}>
                    <Text style={styles.optionName}>{option.name}</Text>
                    {option.popular && (
                      <View style={styles.popularBadge}>
                        <Star size={10} color="#fff" fill="#fff" />
                        <Text style={styles.popularText}>Popular</Text>
                      </View>
                    )}
                    {option.limited && !option.popular && (
                      <View style={styles.limitedBadge}>
                        <Flame size={10} color="#fff" />
                        <Text style={styles.limitedText}>Limitado</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.sizeRow}>
                    <Tag size={12} color="#999" strokeWidth={1.5} />
                    <Text style={styles.optionSize}>{option.size}</Text>
                  </View>
                </View>
                <View style={styles.priceBlock}>
                  <View style={styles.discountTag}>
                    <Text style={styles.discountTagText}>-{option.discount}%</Text>
                  </View>
                  <Text style={styles.priceOriginal}>{option.originalPrice.toFixed(2)}€</Text>
                  <Text style={styles.priceCurrent}>{option.price.toFixed(2)}€</Text>
                </View>
              </View>
            </View>
          ))}
          <View style={styles.promoBar}>
            <Zap size={14} color="#000" strokeWidth={2} />
            <Text style={styles.promoText}>Envío gratis en pedidos +30€</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export default function CustomizationScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Sparkles size={42} color="#000" strokeWidth={1.5} />
          </View>
        </View>
        <Text style={styles.title}>PERSONALIZACIÓN DTF</Text>
        <Text style={styles.subtitle}>Estampa tus diseños favoritos en cualquier prenda</Text>
      </View>

      <View style={styles.highlightBanner}>
        <View style={styles.highlightRow}>
          <Flame size={16} color="#E53935" />
          <Text style={styles.highlightText}>Ofertas de lanzamiento · Hasta 56% dto.</Text>
          <Flame size={16} color="#E53935" />
        </View>
      </View>

      <View style={styles.sectionsContainer}>
        {dtfSections.map((section) => (
          <AccordionSection key={section.id} section={section} />
        ))}
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Shirt size={28} color="#000" strokeWidth={1.5} />
          </View>
          <Text style={styles.cardTitle}>Cualquier Prenda</Text>
          <Text style={styles.cardDescription}>
            Camisetas, sudaderas, chaquetas y más
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Palette size={28} color="#000" strokeWidth={1.5} />
          </View>
          <Text style={styles.cardTitle}>Colores Vibrantes</Text>
          <Text style={styles.cardDescription}>
            Tecnología DTF de última generación
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
    marginBottom: 20,
    paddingVertical: 20,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
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
    fontSize: 26,
    fontWeight: '700' as const,
    color: '#000',
    letterSpacing: 2,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: '#666',
    letterSpacing: 0.3,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  highlightBanner: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFE082',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#E65100',
    letterSpacing: 0.3,
  },
  sectionsContainer: {
    gap: 12,
    marginBottom: 28,
  },
  accordionContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  accordionHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  accordionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accordionTitleGroup: {
    flex: 1,
  },
  accordionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#000',
    letterSpacing: 0.3,
  },
  sectionBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 3,
  },
  sectionBadgeText: {
    fontSize: 9,
    fontWeight: '800' as const,
    color: '#fff',
    letterSpacing: 0.8,
  },
  accordionSubtitle: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: '#888',
    lineHeight: 16,
  },
  accordionBody: {
    overflow: 'hidden',
  },
  optionsList: {
    padding: 12,
    gap: 8,
  },
  optionCard: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#eee',
    padding: 14,
  },
  optionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  optionInfo: {
    flex: 1,
    marginRight: 12,
  },
  optionNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  optionName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1a1a1a',
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  popularText: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: '#fff',
    letterSpacing: 0.3,
  },
  limitedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FF8F00',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  limitedText: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: '#fff',
    letterSpacing: 0.3,
  },
  sizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  optionSize: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: '#999',
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  discountTag: {
    backgroundColor: '#E53935',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginBottom: 4,
  },
  discountTagText: {
    fontSize: 10,
    fontWeight: '800' as const,
    color: '#fff',
    letterSpacing: 0.3,
  },
  priceOriginal: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: '#aaa',
    textDecorationLine: 'line-through',
    marginBottom: 1,
  },
  priceCurrent: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#000',
  },
  promoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    marginTop: 4,
  },
  promoText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#333',
    letterSpacing: 0.2,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#000',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: '#666',
    lineHeight: 18,
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#000',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: '#555',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
});
