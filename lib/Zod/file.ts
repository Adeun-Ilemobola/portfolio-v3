import { z } from "zod";

export const FileKindSchema = z.enum([
    "image",
    "video",
    "audio",
    "document",
    "other",
]);

export const UploadStatusSchema = z.enum([
    "idle",
    "uploading",
    "uploaded",
    "failed",
]);
export type UploadStatus = z.infer<typeof UploadStatusSchema>;

export type FileKind = z.infer<typeof FileKindSchema>;
export const LocalFileSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    kind: FileKindSchema,
    mimeType: z.string().min(1),
    size: z.number().nonnegative(),

    localFile: z.instanceof(File).optional(),
    previewUrl: z.string().optional(), // blob: or base64 or remote preview
    remoteUrl: z.string().url().optional(),
    cloudKey: z.string().optional(),

    alt: z.string().optional(),
    caption: z.string().optional(),

    uploadStatus: UploadStatusSchema.default("idle"),
    progress: z.number().min(0).max(100).optional(),
    error: z.string().optional(),

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});


export type LocalFile = z.infer<typeof LocalFileSchema>;





export const StoredFileSchema = z.object({
    id: z.string().default(" "),
    name: z.string().min(1),
    kind: FileKindSchema,
    mimeType: z.string().min(1),
    size: z.number().nonnegative(),

    remoteUrl: z.string().url(),
    cloudKey: z.string(),

    alt: z.string().optional(),
    caption: z.string().optional(),

    projectId: z.string(),

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type StoredFile = z.infer<typeof StoredFileSchema>;

export function localToStoredFile(localFile: LocalFile , projectId: string): StoredFile {
    const StoredFileSchema = LocalFileSchema.omit({
        localFile: true,
        previewUrl: true,
        uploadStatus: true,
        progress: true,
        error: true,
    }).extend({
        remoteUrl: z.string().url(),
        projectId: z.string(),
        cloudKey: z.string(),
    });
    return StoredFileSchema.parse({
        ...localFile,
        remoteUrl: localFile.remoteUrl || "",
        projectId: projectId,
        cloudKey: localFile.cloudKey ,
    });
}


export function getFileKind(file: File): FileKind {
    const mime = file.type.toLowerCase();

    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";

    if (
        mime.includes("pdf") ||
        mime.includes("text") ||
        mime.includes("document") ||
        mime.includes("word") ||
        mime.includes("sheet") ||
        mime.includes("excel") ||
        mime.includes("presentation") ||
        mime.includes("powerpoint")
    ) {
        return "document";
    }

    return "other";
}

export function createLocalPortfolioFile(file: File): LocalFile {
    const now = new Date();

    return LocalFileSchema.parse({
        id:"local-" + crypto.randomUUID(),
        name: file.name,
        kind: getFileKind(file),
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        localFile: file,
        previewUrl: URL.createObjectURL(file),
        uploadStatus: "idle",
        createdAt: now,
        updatedAt: now,
    });
}

export function createLocalPortfolioFiles(
    files: File[] | FileList
): LocalFile[] {
    return Array.from(files).map(createLocalPortfolioFile);
}


