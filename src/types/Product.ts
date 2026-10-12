export interface Category {
  id: number;
  name: string;
  parentCategoryId: number | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryName: string;
  imageUrl: string | null;
}