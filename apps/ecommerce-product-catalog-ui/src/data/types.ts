export type Product = {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  reviews: number;
  isPopular: boolean;
  isOnSale: boolean;
};
