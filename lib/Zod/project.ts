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
const randomStr = (prefix: string) => `${prefix}-${Math.random().toString(36).substring(2, 8)}`;
const generateMockVideos = (): VideoLink[] => {
  const count = Math.floor(Math.random() * 5) + 1; // 1 to 5 videos
  
  return Array.from({ length: count }, () => ({
    id: `local-${crypto.randomUUID()}`,
    url: `https://demo-video.com/${randomStr("vid")}.mp4`,
    capture: randomStr("capture-image"),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
};

export const generateMockProject = (): ProjectStored => {
  const tagCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 tags

  return {
    id: crypto.randomUUID(),
    title: randomStr("Mock-Project"),
    description: "This is an auto-generated project description for testing purposes.",
    tags: Array.from({ length: tagCount }, (_, i) => `Tag-${i + 1}`),
    files: [], // Explicitly left alone
    videos: generateMockVideos(),
    url: `https://example.com/demo/${randomStr("app")}`,
    githubUrl: `https://github.com/user/${randomStr("repo")}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};