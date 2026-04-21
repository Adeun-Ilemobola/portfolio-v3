import { create } from "zustand";
import { api } from "@/lib/eden";
import { isAfter, isValid, parseISO, subMinutes } from "date-fns";

type MessageType = "error" | "success" | null;

type AuthUiState = {
  isAuthenticated: boolean;
  expire: number | null; // in milliseconds
  token: string | null;
  createdAt: number | null; // timestamp in ms
  msg: {
    type: MessageType;
    content: string | null;
  };

  setSession: (token: string, expire: number) => void;
  setMsg: (type: MessageType, content: string | null) => void;
  clearSession: () => void;
  checkSession: () => Promise<boolean>;
  createSession: (code: string) => Promise<boolean>;
  sendAuthRequest: () => Promise<boolean>;
};

const SESSION_REVALIDATE_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry

export const useAuthUiStore = create<AuthUiState>((set, get) => ({
  isAuthenticated: false,
  expire: null,
  token: null,
  createdAt: null,
  msg: {
    type: null,
    content: null,
  },

  setMsg: (type, content) => {
    set({
      msg: {
        type,
        content,
      },
    });
  },

  setSession: (token, expire) => {
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

  checkSession: async () => {
    try {
      const { token, expire, createdAt, clearSession, setSession } = get();


      if (!token || expire == null || createdAt == null) {
        clearSession();
        return false;
      }
      const expireAt = parseISO(expire.toString());


      const now = Date.now();

      // already expired
      if (isAfter(new Date(), expireAt)) {
        clearSession();
        return false;
      }

      // close to expiry -> ask server to confirm / refresh
      if (isAfter(new Date(), subMinutes(expireAt, 45))) {
        try {
          const { data } = await api.auth.session.get();

          if (!data?.response?.token || !data?.response?.expire) {
            clearSession();
            return false;
          }

          setSession(data.response.token, data.response.expire);
          return true;
        } catch (error) {
          console.error("Session validation error:", error);
          clearSession();
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Session check error:", error);
      get().clearSession();
      return false;
    }
  },

  sendAuthRequest: async () => {
    try {
      const { data } = await api.auth.session.Request.post();

      if (data?.response) {
        get().clearSession();
        get().setMsg("success", "Login code sent to your email. Please check your inbox.");
        return true;
      }

      get().setMsg("error", "Failed to send login code. Please try again.");
      return false;
    } catch (error) {
      console.error("Auth request error:", error);
      get().clearSession();
      get().setMsg("error", "Unable to send login code right now. Please try again.");
      return false;
    }
  },

  createSession: async (code: string) => {
    try {
      const { data } = await api.auth.session.Validate.post({
        loginCode: code,
      });

      if (data?.response?.token && data?.response?.expire) {
        const { token, expire } = data.response;
        get().setSession(token, expire);
        get().setMsg("success", "Authentication successful!");
        return true;
      }

      get().clearSession();
      get().setMsg("error", "Invalid login code. Please try again.");
      return false;
    } catch (error) {
      console.error("Session creation error:", error);
      get().clearSession();
      get().setMsg("error", "An error occurred during authentication. Please try again.");
      return false;
    }
  },
}));