import { axiosClient } from './axiosClient';
import type { Product } from '../types/Product';

export async function getProducts(): Promise<Product[]> {
  const response = await axiosClient.get<Product[]>('/Products');
  return response.data;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  imageUrl: string | null;
}

export async function createProduct(data: ProductPayload) {
  const response = await axiosClient.post('/Products', data);
  return response.data;
}

export async function updateProduct(id: number, data: ProductPayload) {
  await axiosClient.put(`/Products/${id}`, data);
}

export async function deleteProduct(id: number) {
  await axiosClient.delete(`/Products/${id}`);
}