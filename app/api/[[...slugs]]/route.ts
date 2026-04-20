import { Elysia, t } from "elysia";
import { PrismaClient } from "@/generated/prisma/client";
import { PutObjectCommand , DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client } from "@/lib/r2";
import { ProjectStoredSchema } from "@/lib/Zod/project";
import { buildObjectKey, getPublicFileUrl, validateImageFile } from "@/lib/r2-helpers";

const projectRouter = new Elysia({ prefix: "/project" })
    .get("/:id", async ({ params }) => {

    })
    .get("/ShowCase", async () => {

    })
    .post("/create", async ({ body }) => {
        const { id, ...project } = body;


    },
        {
            body: ProjectStoredSchema
        }
    )
    .put("/update/:id", async ({ params, body }) => {

    },
        {
            body: ProjectStoredSchema
        })
    .delete("/delete/:id", async ({ params }) => {

    });

export const app = new Elysia({ prefix: "/api" })
    .use(projectRouter)
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
    .get("/projects", () => {
        return [
            { name: "Project A", description: "A cool project" },
            { name: "Project B", description: "Another cool project" },
            { name: "Project C", description: "Yet another cool project" },
        ]
    })
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
    )
    .post(
        "/file/upload",
        async ({ body, status }) => {
            const { id, file } = body;

            try {
                const fileName = file.name;
                const contentType = file.type;
                const size = file.size;

                validateImageFile({ fileName, contentType, size });

                const key = buildObjectKey(fileName, id);
                const bucket = process.env.R2_BUCKET_NAME;

                if (!bucket) {
                    return status(500, {
                        success: false,
                        message: "Missing R2_BUCKET_NAME",
                        data: null,
                    });
                }

                const r2 = getR2Client();

                await r2.send(
                    new PutObjectCommand({
                        Bucket: bucket,
                        Key: key,
                        Body: Buffer.from(await file.arrayBuffer()),
                        ContentType: contentType,
                    })
                );

                const fileUrl = getPublicFileUrl(key);

                return {
                    success: true,
                    message: "File uploaded successfully",
                    data: {
                        key,
                        url: fileUrl,
                    },
                };
            } catch (error) {
                console.error("Upload route failed:", error);

                return status(500, {
                    success: false,
                    message:
                        error instanceof Error ? error.message : "Error uploading file.",
                    data: null,
                });
            }
        },
        {
            body: t.Object({
                id: t.String(),
                file: t.File({ format: "image/*" }),
            }),
        }
    )
    .post("/file/delete", async ({ body, status }) => {
        const { key } = body;

        try {
            const bucket = process.env.R2_BUCKET_NAME;

            if (!bucket) {
                return status(500, {
                    success: false,
                    message: "Missing R2_BUCKET_NAME",
                });
            }

            const r2 = getR2Client();

            await r2.send(
                new DeleteObjectCommand({
                    Bucket: bucket,
                    Key: key,
                })
            );

            return {
                success: true,
                message: "File deleted successfully",
            };
        } catch (error) {
            console.error("Delete route failed:", error);

            return status(500, {
                success: false,
                message:
                    error instanceof Error ? error.message : "Error deleting file.",
            });
        }

    },
        {
            body: t.Object({
                key: t.String(),
            }),
        }
    );




export const GET = app.fetch;
export const POST = app.fetch;