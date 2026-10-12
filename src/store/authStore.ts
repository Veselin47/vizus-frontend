import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
}

interface AuthState {
  token: string | null;
  email: string | null;
  fullName: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (token: string, email: string, fullName: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      fullName: null,
      role: null,
      isAuthenticated: false,
      login: (token, email, fullName) => {
        const decoded = jwtDecode<JwtPayload>(token);
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        set({ token, email, fullName, role, isAuthenticated: true });
      },
      logout: () =>
        set({ token: null, email: null, fullName: null, role: null, isAuthenticated: false }),
    }),
    { name: 'vizus-auth' },
  ),
);