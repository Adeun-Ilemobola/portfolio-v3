import { create } from "zustand";
import { api } from "@/lib/eden";
import { isAfter, parseISO, subMinutes } from "date-fns";
import { t } from "elysia";

type MessageType = "error" | "success" | null;
type LocalStorageData = {
  token: string;
  expire: string;
};

type AuthUiState = {
  isAuthenticated: boolean;
  expire: Date | null; // in milliseconds
  token: string | null;
  createdAt: number | null; // timestamp in ms
  msg: {
    type: MessageType;
    content: string | null;
  };

  setSession: (token: string, expire: Date) => void;
  setMsg: (type: MessageType, content: string | null) => void;
  clearSession: () => void;
  checkSession: () => Promise<boolean>;
  createSession: (code: string) => Promise<boolean>;
  sendAuthRequest: () => Promise<boolean>;
};


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
    const localData: LocalStorageData = {
      token,
      expire: expire.toISOString(),
    };
    localStorage.setItem("auth", JSON.stringify(localData));
  },

  clearSession: () => {
    set({
      isAuthenticated: false,
      token: null,
      expire: null,
      createdAt: null,
    });
    localStorage.removeItem("auth");
  },

  checkSession: async () => {
    try {
      const { token, expire, createdAt, clearSession, setSession } = get();


      if (!token || expire == null || createdAt == null) {
        // no session data check local storage to preview the data. Then it rejects the local storage info if it's expired.
        const localToken = localStorage.getItem("auth");
        if (localToken) {
          try {
            const parsed: LocalStorageData = JSON.parse(localToken);
            const expireAt = parseISO(parsed.expire);
            if (isAfter(new Date(), expireAt)) {
              localStorage.removeItem("auth");
              get().clearSession();
              return false;
            }
            setSession(parsed.token, expireAt);
          } catch (error) {
            console.error("Failed to parse local storage auth data:", error);
            localStorage.removeItem("auth");
            get().clearSession();
            return false;
          }
        }

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
            console.log("Failed to refresh session");
            return false;
          }

          setSession(data.response.token, data.response.expire);
          console.log("Session refreshed successfully:", { token: data.response.token, expire: data.response.expire });
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
      const { data , error   } = await api.auth.session.request.post();

      if (data?.response) {
        get().clearSession();
        get().setMsg("success", "Login code sent to your email. Please check your inbox.");
        console.log("Login code sent successfully");
        return true;
      }

      if (error) {
        get().clearSession();
        get().setMsg("error", "Failed to send login code. Please try again.");
        console.log("Failed login code request attempt:", error);
        throw Error("Auth request failed: " + error);
      }
        

      get().setMsg("error", "Failed to send login code. Please try again.");
      console.log("Failed login code request attempt");
      throw Error("Auth request failed: No response from server" + JSON.stringify(data));
    } catch (error) {
      console.error("Auth request error:", error);
      get().clearSession();
      get().setMsg("error", "Unable to send login code right now. Please try again.");
      throw Error("Auth request failed" + error);
     
    }
  },

  createSession: async (code: string) => {
    try {
      const { data } = await api.auth.session.validate.post({
        loginCode: code,
      });

      if (data?.response?.token && data?.response?.expire) {
        const { token, expire } = data.response;
        get().setSession(token, expire);
        get().setMsg("success", "Authentication successful!");
        console.log("Session created:", { token, expire });
        return true;
      }

      get().clearSession();
      get().setMsg("error", "Invalid login code. Please try again.");
      console.log("Invalid login code attempt:", { code });
      return false;
    } catch (error) {
      console.error("Session creation error:", error);
      get().clearSession();
      get().setMsg("error", "An error occurred during authentication. Please try again.");
      return false;
    }
  },
}));