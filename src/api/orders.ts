import { axiosClient } from './axiosClient';
import type { CreateOrderRequest } from '../types/Shipping';
import type { CreateOrderResult } from '../types/Order';
import type { AdminOrder } from '../types/Order';

export async function createOrder(data: CreateOrderRequest): Promise<CreateOrderResult> {
  const response = await axiosClient.post<CreateOrderResult>('/Orders', data);
  return response.data;
}

export async function getAllOrders(): Promise<AdminOrder[]> {
  const response = await axiosClient.get<AdminOrder[]>('/Orders');
  return response.data;
}

export async function updateOrderStatus(id: number, status: string) {
  await axiosClient.put(`/Orders/${id}/status`, { status });
}