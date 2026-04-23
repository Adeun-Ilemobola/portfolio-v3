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


const BaseFileSchema = z.object({
  id: z.string().default(""),
  name: z.string().min(1),
  kind: FileKindSchema,
  mimeType: z.string().min(1),
  size: z.number().nonnegative(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  projectId: z.string().default(""),
  uploadStatus: UploadStatusSchema.default("idle"),
});

export const ClientFileSchema = BaseFileSchema.extend({
  localFile: z.custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File
  ).optional(),
  remoteUrl: z.string().url(),
  cloudKey: z.string().optional(),
});

export type ClientFile = z.infer<typeof ClientFileSchema>;

export const PersistedFileSchema = BaseFileSchema.extend({
  remoteUrl: z.string().url(),
  cloudKey: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type PersistedFile = z.infer<typeof PersistedFileSchema>;


export const SaveFilePayloadSchema = ClientFileSchema.omit({
  localFile: true,
});
export type SaveFilePayload = z.infer<typeof SaveFilePayloadSchema>;


export function createClientFile(file: File): ClientFile {
    return ClientFileSchema.parse({
        id: "local-" + crypto.randomUUID(),
        localFile: file,
        remoteUrl: URL.createObjectURL(file),
        name: file.name,
        kind: getFileKind(file),
        mimeType: file.type,
        size: file.size,
        alt: "",
        caption: "",
    });
}




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

    projectId: z.string().default(" "),
    uploadStatus: UploadStatusSchema.default("idle"),
    localFile: z.instanceof(File).optional(),


    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type StoredFile = z.infer<typeof StoredFileSchema>;



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

export function createLocalPortfolioFile(file: File): StoredFile {
    const now = new Date();

    return StoredFileSchema.parse({
        id:"local-" + crypto.randomUUID(),
        name: file.name,
        kind: getFileKind(file),
        mimeType: file.type,
        size: file.size,
        localFile: file,
        remoteUrl: URL.createObjectURL(file),
 
        
    });
}

export function createLocalPortfolioFiles(
    files: File[] | FileList
): StoredFile[] {
    return Array.from(files).map(createLocalPortfolioFile);
}


