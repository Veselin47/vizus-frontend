import { axiosClient } from './axiosClient';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/Auth';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>('/Auth/login', data);
  return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await axiosClient.post<AuthResponse>('/Auth/register', data);
  return response.data;
}