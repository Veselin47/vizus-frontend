import { API_BASE_URL } from '../api/axiosClient';

export function getImageUrl(url: string | null): string | null {
  if (!url) return null;
  return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
}