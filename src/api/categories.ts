import { axiosClient } from './axiosClient';
import type { Category } from '../types/Product';

export async function getCategories(): Promise<Category[]> {
  const response = await axiosClient.get<Category[]>('/Categories');
  return response.data;
}

export interface CategoryPayload {
  name: string;
  parentCategoryId: number | null;
}

export async function createCategory(data: CategoryPayload) {
  const response = await axiosClient.post('/Categories', data);
  return response.data;
}

export async function updateCategory(id: number, data: CategoryPayload) {
  await axiosClient.put(`/Categories/${id}`, data);
}

export async function deleteCategory(id: number) {
  await axiosClient.delete(`/Categories/${id}`);
}