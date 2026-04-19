import { Elysia, t } from "elysia";
import { PrismaClient } from "@/generated/prisma/client"; 
import { file } from "@/generated/prismabox/file";


import { prisma } from "@/lib/server/prisma";

export const app = new Elysia({ prefix: "/api" })
  .get("/", () => "Hello from Elysia")
  .get("/status", () => ({
    ok: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  }))
  .get("/profile", () => ({
    name: "AD",
    role: "Frontend / Systems Builder",
    stack: ["Next.js", "Tailwind", "shadcn/ui", "Zustand", "Elysia"],
    experimental: true,
  }))
  .get("/projects", () => [
    { id: 1, title: "Project 1", slug: "project-1" },
    { id: 2, title: "Project 2", slug: "project-2" },
    { id: 3, title: "Project 3", slug: "project-3" },
  ])
  .post(
    "/echo",
    ({ body }) => ({
      received: body,
      success: true,
      message: `Received ${body.name}`,
    }),
    {
      body: t.Object({
        name: t.String(),
      }),
    }
  );

export const GET = app.fetch;
export const POST = app.fetch;