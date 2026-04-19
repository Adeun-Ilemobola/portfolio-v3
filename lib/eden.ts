import { treaty } from "@elysiajs/eden";
import type { App } from "@/lib/server/eden";

export const api = treaty<App>("http://localhost:3000").api;