
import {z} from "zod";


export const  authSessionSchema = z.object({
id: z.string(),
  token: z.string(),
  expire: z.number(),
  isValid: z.boolean(),
  loginCode: z.number(),
});

export type AuthSession = z.infer<typeof authSessionSchema>;