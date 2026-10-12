import { axiosClient } from './axiosClient';
import type { EcontCity, EcontOffice } from '../types/Shipping';

export async function getEcontCities(search: string): Promise<EcontCity[]> {
  const response = await axiosClient.get<EcontCity[]>('/Shipping/econt/cities', {
    params: { search },
  });
  return response.data;
}

export async function getEcontOffices(cityId: number): Promise<EcontOffice[]> {
  const response = await axiosClient.get<EcontOffice[]>('/Shipping/econt/offices', {
    params: { cityId },
  });
  return response.data;
}