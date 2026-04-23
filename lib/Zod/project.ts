import { z } from "zod";
import { PersistedFileSchema } from "./file";



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
    files: z.array(PersistedFileSchema).min(1).max(18),
    videos: z.array(VideoLinkSchema).min(0),
    url: z.string().url().optional(),
    githubUrl: z.string().url().optional(),

    createdAt: z.coerce.date().default(() => new Date()),
    updatedAt: z.coerce.date().default(() => new Date()),
});



export type ProjectStored = z.infer<typeof ProjectStoredSchema>;