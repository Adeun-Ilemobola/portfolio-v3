import {z} from "zod";

export const ContactSchema = z.object({
    name: z.string().min(1, "Name is required").default(""),
    email: z.string().email("Invalid email address").default(""),
    message: z.string().min(1, "Message is required").default(""),
    company: z.string().optional().default(""),
    phone: z.string().optional().default(""),
});

export type ContactData = z.infer<typeof ContactSchema>;