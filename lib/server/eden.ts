import { treaty } from "@elysiajs/eden";
import { app } from "@/app/api/[[...slugs]]/route";

export const serverApi = treaty(app).api;
export type App = typeof app;