import { axiosClient } from './axiosClient';
import type { CreateOrderRequest } from '../types/Shipping';
import type { CreateOrderResult } from '../types/Order';

export async function createOrder(data: CreateOrderRequest): Promise<CreateOrderResult> {
  const response = await axiosClient.post<CreateOrderResult>('/Orders', data);
  return response.data;
}