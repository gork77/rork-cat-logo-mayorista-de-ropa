import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useState, useCallback } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Plus, Minus } from 'lucide-react-native';
import { PRODUCTS } from '@/mocks/products';
import { ProductCategory, Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import * as Haptics from 'expo-haptics';

const WINDOW_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 12;
const CARD_WIDTH = (WINDOW_WIDTH - CARD_MARGIN * 3) / 2;

type ProductState = {
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
};

export default function CatalogScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [productStates, setProductStates] = useState<Record<string, ProductState>>({});
  const { addToCart } = useCart();

  const filteredProducts = selectedCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory);

  const getProductState = (productId: string, product: Product): ProductState => {
    return productStates[productId] || {
      quantity: 1,
      selectedSize: product.sizes[0],
      selectedColor: product.colors?.[0],
    };
  };

  const handleAddToCart = (product: Product) => {
    const state = getProductState(product.id, product);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    addToCart(product, state.quantity, state.selectedSize, state.selectedColor);
  };

  const updateProductState = useCallback((productId: string, product: Product, updates: Partial<ProductState>) => {
    setProductStates(prev => {
      const defaultState = {
        quantity: 1,
        selectedSize: product.sizes[0],
        selectedColor: product.colors?.[0],
      };
      const current = prev[productId] || defaultState;
      return {
        ...prev,
        [productId]: { ...current, ...updates }
      };
    });
  }, []);

  const incrementQuantity = useCallback((productId: string, product: Product) => {
    setProductStates(prev => {
      const current = prev[productId] || {
        quantity: 1,
        selectedSize: product.sizes[0],
        selectedColor: product.colors?.[0],
      };
      return {
        ...prev,
        [productId]: { ...current, quantity: current.quantity + 1 }
      };
    });
  }, []);

  const decrementQuantity = useCallback((productId: string, product: Product) => {
    setProductStates(prev => {
      const current = prev[productId] || {
        quantity: 1,
        selectedSize: product.sizes[0],
        selectedColor: product.colors?.[0],
      };
      return {
        ...prev,
        [productId]: { ...current, quantity: Math.max(1, current.quantity - 1) }
      };
    });
  }, []);

  const renderProduct = ({ item }: { item: Product }) => {
    const state = getProductState(item.id, item);
    
    return (
      <View style={styles.productCard}>
        <TouchableOpacity 
          onPress={() => router.push(`/product-detail?id=${item.id}`)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: item.image }} style={styles.productImage} contentFit="cover" />
        </TouchableOpacity>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productPrice}>{(item.price || 0).toFixed(2)}€</Text>
          
          <View style={styles.sizeContainer}>
            <Text style={styles.optionLabel}>Talla</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sizeScroll}>
              {item.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOption,
                    state.selectedSize === size && styles.sizeOptionActive
                  ]}
                  onPress={() => updateProductState(item.id, item, { selectedSize: size })}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.sizeText,
                    state.selectedSize === size && styles.sizeTextActive
                  ]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {item.colors && (
            <View style={styles.colorContainer}>
              <Text style={styles.optionLabel}>Color</Text>
              <View style={styles.colorOptions}>
                {item.colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      state.selectedColor === color && styles.colorOptionActive
                    ]}
                    onPress={() => updateProductState(item.id, item, { selectedColor: color })}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.colorCircle, { backgroundColor: color }]} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.footer}>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => decrementQuantity(item.id, item)}
                activeOpacity={0.7}
              >
                <Minus size={10} color="#000" strokeWidth={2.5} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{state.quantity || 1}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => incrementQuantity(item.id, item)}
                activeOpacity={0.7}
              >
                <Plus size={10} color="#000" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>Añadir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
        style={styles.filterContainer}
      >
        <TouchableOpacity
          style={[styles.filterButton, selectedCategory === 'all' && styles.filterButtonActive]}
          onPress={() => setSelectedCategory('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, selectedCategory === 'all' && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedCategory === 'tshirt' && styles.filterButtonActive]}
          onPress={() => setSelectedCategory('tshirt')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, selectedCategory === 'tshirt' && styles.filterTextActive]}>
            Camisetas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedCategory === 'hoodie' && styles.filterButtonActive]}
          onPress={() => setSelectedCategory('hoodie')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, selectedCategory === 'hoodie' && styles.filterTextActive]}>
            Sudaderas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedCategory === 'jacket' && styles.filterButtonActive]}
          onPress={() => setSelectedCategory('jacket')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, selectedCategory === 'jacket' && styles.filterTextActive]}>
            Chaquetas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedCategory === 'accessories' && styles.filterButtonActive]}
          onPress={() => setSelectedCategory('accessories')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, selectedCategory === 'accessories' && styles.filterTextActive]}>
            Accesorios
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    minHeight: 34,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#666',
    letterSpacing: 0.3,
  },
  filterTextActive: {
    color: '#fff',
  },
  productList: {
    padding: CARD_MARGIN,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 0,
    marginBottom: CARD_MARGIN,
    overflow: 'hidden',
  },
  productImage: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    backgroundColor: '#f8f9fa',
  },
  productInfo: {
    padding: 12,
    gap: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#000',
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#000',
  },
  sizeContainer: {
    gap: 6,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: '#666',
    letterSpacing: 0.5,
  },
  sizeScroll: {
    flexGrow: 0,
  },
  sizeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 6,
    minWidth: 36,
    alignItems: 'center',
  },
  sizeOptionActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  sizeText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: '#666',
  },
  sizeTextActive: {
    color: '#fff',
  },
  colorContainer: {
    gap: 6,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  colorOption: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionActive: {
    borderColor: '#000',
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  quantityText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: '#000',
    minWidth: 24,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  addButton: {
    flex: 1,
    height: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
});
