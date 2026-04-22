import { z } from "zod";
import { StoredFileSchema } from "./file";



export const VideoLinkSchema = z.object({
    id: z.string().default(() =>"local-" + crypto.randomUUID()),
    url: z.string().url(),
    capture: z.string().min(1),
    createdAt: z.coerce.date().default(() => new Date()),
    updatedAt: z.coerce.date().default(() => new Date()),
})

export type VideoLink = z.infer<typeof VideoLinkSchema>;

export const ProjectStoredSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string()),
    files: z.array(StoredFileSchema).optional(),
    videos: z.array(VideoLinkSchema).optional(),
    url: z.string().url().optional(),
    githubUrl: z.string().url().optional(),

    createdAt: z.coerce.date().default(() => new Date()),
    updatedAt: z.coerce.date().default(() => new Date()),
});



export type ProjectStored = z.infer<typeof ProjectStoredSchema>;