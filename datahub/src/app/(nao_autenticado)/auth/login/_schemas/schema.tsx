import z from "zod";

export const formSchema = z.object({
    email: z.email(),
    senha: z.string(),
});