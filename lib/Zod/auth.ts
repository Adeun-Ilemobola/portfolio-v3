
import {isValid, z} from "zod";


export const  authSessionSchema = z.object({
id: z.string(),
  token: z.string(),
  expire: z.number(),
  isValid: z.boolean(),
});

export type AuthSession = z.infer<typeof authSessionSchema>;