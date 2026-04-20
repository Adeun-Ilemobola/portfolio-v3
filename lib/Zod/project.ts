import { z } from "zod";
import { StoredFileSchema } from "./file";





export const ProjectStoredSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string()),
    files: z.array(StoredFileSchema).optional(),
    url: z.string().url().optional(),
    githubUrl: z.string().url().optional(),

    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type ProjectStored = z.infer<typeof ProjectStoredSchema>;