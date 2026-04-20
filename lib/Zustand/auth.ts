import { create } from "zustand";

type AuthUiState = {
  isAuthenticated: boolean;
  expire: number | null;
  token: string | null;
  createdAt: number | null;


  createSession: (token: string, expire: number) => void;
  clearSession: () => void;
  checkSession: () => boolean;

  sendAuthRequest: () => Promise<void>;
 
};

export const useAuthUiStore = create<AuthUiState>((set , get) => ({
  isAuthenticated: false,
  expire: null,
  token: null,
  createdAt: null,
  createSession: (token: string, expire: number) => {
    set({
      isAuthenticated: true,
      token,
      expire,
      createdAt: Date.now(),
    });
  },
  clearSession: () => {
    set({
      isAuthenticated: false,
      token: null,
      expire: null,
      createdAt: null,
    });
  },
  checkSession: () => {
    const { expire , token } = get();
    if (!token) {
      return false;
    }

    const isValid = expire && expire < Date.now();
    if (!isValid) {
      get().clearSession();
      return false;
    }
    return true;
  },
  sendAuthRequest: async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Auth request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.token && data.expire) {
        set({
          isAuthenticated: true,
          token: data.token,
          expire: data.expire,
          createdAt: Date.now(),
        });
      } else {
        throw new Error(data.message || "Auth request failed");
      }
    } catch (error) {
      console.error("Auth request error:", error);
      set({
        isAuthenticated: false,
        token: null,
        expire: null,
        createdAt: null,
      });
    }
  }
}));