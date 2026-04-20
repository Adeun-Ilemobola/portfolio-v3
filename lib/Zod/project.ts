import { z } from "zod";
import { StoredFileSchema } from "./file";





export const ProjectStoredSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    description: z.string().optional(),
    tags: z.array(z.string()),
    files: z.array(StoredFileSchema).optional(),

    createdAt: z.string(),
    updatedAt: z.string(),
});

export type ProjectStored = z.infer<typeof ProjectStoredSchema>;