import { create } from "zustand";

type AuthUiState = {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email?: string) => void;
  logout: () => void;
};

export const useAuthUiStore = create<AuthUiState>((set) => ({
  isAuthenticated: false,
  adminEmail: null,
  login: (email) =>
    set({
      isAuthenticated: true,
      adminEmail: email ?? "adeun@example.com",
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      adminEmail: null,
    }),
}));