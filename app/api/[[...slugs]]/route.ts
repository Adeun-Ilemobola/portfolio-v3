import { Elysia, t } from "elysia";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client } from "@/lib/r2";
import { ProjectStoredSchema } from "@/lib/Zod/project";
import { buildObjectKey, getPublicFileUrl, validateImageFile } from "@/lib/r2-helpers";
import { prisma } from "@/lib/server/prisma";
import { addDays , isAfter } from "date-fns";
import { emailSwitcher } from "@/lib/reSend";

const projectRouter = new Elysia({ prefix: "/project" })
    .get("/:id", async ({ params, status }) => {
        const getProject = await prisma.project.findUnique({
            where: { id: params.id },
            include: {
                files: true,
            },
        });

        if (!getProject) {
            return status(404, {
                success: false,
                message: "Project not found",
                response: null,
            });
        }

        return {
            success: true,
            message: "Project retrieved successfully",
            response: getProject,
        };

    })
    .get("/ShowCase", async () => {
        const projects = await prisma.project.findMany({
            select: {
                id: true,
                title: true,
            }
        });

        return {
            success: true,
            message: "Projects retrieved successfully",
            response: projects,
        };

    })
    .post("/create", async ({ body, status }) => {
        const { id, createdAt, updatedAt, files, ...project } = body;
        try {
            const newProject = await prisma.project.create({
                data: {
                    title: project.title,
                    description: project.description,
                    tags: project.tags,
                    url: project.url,
                    githubUrl: project.githubUrl,

                },
            });
            await prisma.file.createMany({
                data: files?.map((file) => ({
                    id: file.id,
                    name: file.name,
                    kind: file.kind,
                    mimeType: file.mimeType,
                    size: file.size,
                    projectId: newProject.id,
                    remoteUrl: file.remoteUrl,
                    cloudKey: file.cloudKey,
                    createdAt: file.createdAt,
                    updatedAt: file.updatedAt,
                })) || [],
            });
            return {
                success: true,
                message: "Project created successfully",
                response: newProject,
            };

        } catch (error) {
            console.error("Create project failed:", error);
            return status(500, {
                success: false,
                message:
                    error instanceof Error ? error.message : "Error creating project.",
                response: null,
            });


        }
    },
        {
            body: ProjectStoredSchema
        }
    )
    .put("/update/:id", async ({ params, body, status }) => {
        const { createdAt, updatedAt, files, ...project } = body;
        try {
            const updatedProject = await prisma.project.update({
                where: { id: params.id },
                data: {
                    title: project.title,
                    description: project.description,
                    tags: project.tags,
                    url: project.url,
                    githubUrl: project.githubUrl,
                    updatedAt: new Date(),
                },
            });

            const existingFiles = await prisma.file.findMany({
                where: { projectId: params.id },
            });

            const getnewFiles = files?.filter((file) => file.id.startsWith("local-")) || [];

            const deleteFileIds = existingFiles
                .filter((file) => !files?.some((f) => f.id === file.id))
                .map((file) => file);

            if (deleteFileIds.length > 0) {
                deleteFileIds.forEach(async (file) => {
                    try {
                        await getR2Client().send(
                            new DeleteObjectCommand({
                                Bucket: process.env.R2_BUCKET_NAME!,
                                Key: file.cloudKey!,
                            })
                        );
                        await prisma.file.delete({
                            where: { id: file.id },
                        });
                    } catch (error) {
                        console.error(`Failed to delete file ${file.id} from R2:`, error);
                    }

                });
            }


            await prisma.file.createMany({
                data: getnewFiles.map((file) => ({
                    id: file.id,
                    name: file.name,
                    kind: file.kind,
                    mimeType: file.mimeType,
                    size: file.size,
                    projectId: params.id,
                    remoteUrl: file.remoteUrl,
                    cloudKey: file.cloudKey,

                })),
            });

            return {
                success: true,
                message: "Project updated successfully",
                response: updatedProject,
            };
        } catch (error) {
            console.error("Update project failed:", error);
            return status(500, {
                success: false,
                message:
                    error instanceof Error ? error.message : "Error updating project.",
                response: null,
            });
        }
    },
        {
            body: ProjectStoredSchema
        })
    .delete("/delete/:id", async ({ params, status }) => {
        try {
            const project = await prisma.project.findUnique({
                where: { id: params.id },
                include: { files: true },
            });

            if (!project) {
                return status(404, {
                    success: false,
                    message: "Project not found",
                });
            }

            await Promise.all(
                project.files.map(async (file) => {
                    try {
                        await getR2Client().send(
                            new DeleteObjectCommand({
                                Bucket: process.env.R2_BUCKET_NAME!,
                                Key: file.cloudKey!,
                            })
                        );
                        await prisma.file.delete({
                            where: { id: file.id },
                        });
                    } catch (error) {
                        console.error(`Failed to delete file ${file.id} from R2:`, error);
                    }
                })
            );

            await prisma.project.delete({
                where: { id: params.id },
            });

            return {
                success: true,
                message: "Project deleted successfully",
            };
        } catch (error) {
            console.error("Delete project failed:", error);
            return status(500, {
                success: false,
                message:
                    error instanceof Error ? error.message : "Error deleting project.",
            });
        }

    });

const  SessionRouter = new Elysia({ prefix: "/auth" })
.get("/session", async ({ status }) => {
    try {
        const getSession = await prisma.authSessionSchema.findFirst({
            orderBy: { createdAt: "desc" },
        });

        if (!getSession) {
            return status(404, {
                success: false,
                message: "No active session found",
                response: null,
            });
        }
        return {
            success: true,
            message: "Session is valid",
            response: {
                token: getSession.token,
                expire: getSession.expire,
            },
        };
    } catch (error) {
        console.error("Session check failed:", error);
        return status(401, {
            success: false,
            message:
                error instanceof Error ? error.message : "Session is invalid.",
            response: null,
        });
    }
})
.post("/session/Request", async ({ status }) => {
    try {
        
        const loginCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expireAt = addDays(new Date(), 1);
        const session = await prisma.authSessionSchema.create({
            data: {
                token: crypto.randomUUID(),
                expire: expireAt, // 1 day in milliseconds
                loginCode,
            },
        });
        // send the login code to the user via email or other means here
        const emailSent = await emailSwitcher("sendCode", { code: loginCode });
        if (!emailSent) {
            await prisma.authSessionSchema.delete({
                where: { id: session.id },
            });
            return status(500, {
                success: false,
                message: "Failed to send login code email.",
                response: null,
            });
        }

        return {
            success: true,
            response:"Login code sent successfully",
        };
    } catch (error) {
        console.error("Auth request failed:", error);
        return status(500, {
            success: false,
            message:
                error instanceof Error ? error.message : "Error creating session.",
            response: null,
        });
    }
}
)
.post("/session/Validate", async ({ body, status }) => {
    const { loginCode } = body;
    try {
        const session = await prisma.authSessionSchema.findFirst({
            where: { loginCode },
            orderBy: { createdAt: "desc" },
        });

        if (!session) {
            return status(404, {
                success: false,
                message: "Invalid login code",
                response: null,
            });
        }

        if (isAfter(new Date(), session.expire)) {
            return status(401, {
                success: false,
                message: "Login code has expired",
                response: null,
            });
        }

       
        return {
            success: true,
            message: "Session validated successfully",
            response: {
                token: session.token,
                expire: session.expire,
            },
        };
    } catch (error) {
        console.error("Session validation failed:", error);
        return status(500, {
            success: false,
            message:
                error instanceof Error ? error.message : "Error validating session.",
            response: null,
        });
    }
},
{
    body: t.Object({
        loginCode: t.String(),
    }),
}
);

export const app = new Elysia({ prefix: "/api" })
    .use(SessionRouter)
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