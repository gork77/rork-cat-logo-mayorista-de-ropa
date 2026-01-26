export type ProductCategory = 'tshirt' | 'hoodie' | 'jacket' | 'accessories';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  image: string;
  description: string;
  sizes: string[];
  colors?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor?: string;
}
