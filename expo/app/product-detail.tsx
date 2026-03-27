import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Plus, Minus, ShoppingCart, ChevronLeft } from 'lucide-react-native';
import { PRODUCTS } from '@/mocks/products';
import { useCart } from '@/contexts/CartContext';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const product = PRODUCTS.find(p => p.id === id);
  
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors?.[0]);
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Producto no encontrado</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToCart(product, quantity, selectedSize, selectedColor);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.imageContainer, selectedColor && { backgroundColor: selectedColor }]}>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: product.image }} 
              style={styles.productImage}
              contentFit="cover"
            />
          </View>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color="#000" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerSection}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{(product.price || 0).toFixed(2)}€</Text>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>DESCRIPCIÓN</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.optionsSection}>
            <Text style={styles.sectionTitle}>TALLA</Text>
            <View style={styles.sizesContainer}>
              {product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.sizeButtonActive
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedSize(size);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.sizeButtonText,
                    selectedSize === size && styles.sizeButtonTextActive
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {product.colors && (
            <View style={styles.optionsSection}>
              <Text style={styles.sectionTitle}>COLOR</Text>
              <View style={styles.colorsContainer}>
                {product.colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      selectedColor === color && styles.colorButtonActive
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedColor(color);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.colorCircle, { backgroundColor: color }]} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.quantitySection}>
            <Text style={styles.sectionTitle}>CANTIDAD</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setQuantity(Math.max(1, quantity - 1));
                }}
                activeOpacity={0.7}
              >
                <Minus size={16} color="#000" strokeWidth={2.5} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity || 1}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setQuantity(quantity + 1);
                }}
                activeOpacity={0.7}
              >
                <Plus size={16} color="#000" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalPrice}>{((product.price || 0) * (quantity || 1)).toFixed(2)}€</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <ShoppingCart size={20} color="#fff" strokeWidth={2} />
          <Text style={styles.addToCartButtonText}>Añadir al Carrito</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.3,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contentContainer: {
    padding: 20,
  },
  headerSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 20,
    marginBottom: 24,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 8,
    letterSpacing: 0.3,
    lineHeight: 32,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#000',
  },
  descriptionSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#666',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  optionsSection: {
    marginBottom: 32,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 60,
    alignItems: 'center',
  },
  sizeButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  sizeButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: '#666',
    letterSpacing: 0.3,
  },
  sizeButtonTextActive: {
    color: '#fff',
  },
  colorsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButtonActive: {
    borderColor: '#000',
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#000',
    minWidth: 36,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#666',
    letterSpacing: 0.3,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#000',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addToCartButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
    letterSpacing: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
});
