import { create } from "zustand";
import{api} from "@/lib/eden";

type AuthUiState = {
  isAuthenticated: boolean;
  expire: number | null;
  token: string | null;
  createdAt: number | null;
  msg:{
    type: "error" | "success" | null;
    content: string | null;
  }


  SetSession: (token: string, expire: number) => void;
  SetMeg: (type: "error" | "success"| null, content: string | null) => void;
  clearSession: () => void;
  checkSession: () => Promise<boolean>;
  createSession: (code: string) => Promise<void>; 


  sendAuthRequest: () => Promise<void>;
 
};

const MAX_TIMETOCHECK = 70 * (60 * 1000); // 70 minutes in milliseconds

export const useAuthUiStore = create<AuthUiState>((set , get) => ({
  isAuthenticated: false,
  expire: null,
  token: null,
  createdAt: null,
  msg: {
    type: null,
    content: null,
  },
  SetMeg: (type, content) => {
    set({
      msg: {
        type,
        content,
      },
    });
  },
  SetSession: (token: string, expire: number) => {
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
    const { token, expire, createdAt } = get();
     

    if (!token || !expire || !createdAt) {
      get().clearSession();
      return false;
    }
    const liveSpan = createdAt + expire * 1000;

    const currentTime = Date.now();
    if (currentTime > liveSpan) {
      get().clearSession();
      return false;
    }else if (currentTime > liveSpan - MAX_TIMETOCHECK) {
      // every 70 minutes check the server and confirm the session is valid if not clear the session and ask the user to login again
      try {
        const {data} = await api.auth.session.get();
        if (!data) {
          get().clearSession();
          return false;
        }
        get().SetSession(data.response.token, data.response.expire);
       get().checkSession(); // recheck the session with the new data
       return true;
      } catch (error) {
        console.error("Session validation error:", error);
        get().clearSession();
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
      const {data} = await api.auth.session.Request.post();
      if (data && data.response ) {
        get().SetMeg("success", "Login code sent to your email. Please check your inbox.");
        get().clearSession(); // Clear any existing session data
        
        return;
      } else {
        get().SetMeg("error", "Failed to send login code. Please try again.");
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
  },
  createSession: async (code: string) => {
    try {      
      const {data} = await api.auth.session.Validate.post({
        loginCode: code,
      })
      if (data && data.response) {
        const { token, expire } = data.response;
        get().SetSession(token, expire);
        get().SetMeg("success", "Authentication successful!");
      } else {
        get().SetMeg("error", "Invalid login code. Please try again.");
      }
    } catch (error) {
      console.error("Session creation error:", error);
      get().SetMeg("error", "An error occurred during authentication. Please try again.");
    } 

  }
}));