export interface Product {
  id: string;
  name: string;
  nameGe?: string;
  price: number;
  images: string[];
  sizes: string[];
  category: "hoodie" | "t-shirt" | "accessories";
  gender: "male" | "female" | "unisex";
  description: string;
  descriptionGe?: string;
  limited?: boolean;
  inStock?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  status: "pending" | "paid" | "shipped";
}
