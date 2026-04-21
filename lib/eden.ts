import { treaty } from "@elysiajs/eden";
import type { App } from "@/lib/server/eden";

function ev(mode: "development" | "production") {
    if (mode === "development") {
        return "http://localhost:3000";
    }
    return "https://www.adeunilemobola.dev/";
    
}

export const api = treaty<App>(ev(process.env.NODE_ENV === "development" ? "development" : "production")).api;