import { formataTelefone } from "@/helper/formatador";
import z from "zod";

export const clienteSchemaEdicao = z.object({
    id: z.uuidv7("ID do cliente inválido"),
    dados: z
        .object({
            telefone: z.string().refine(
                telefone => formataTelefone(telefone) !== null,
                {
                    message: "Digite um telefone valido",
                }
            ).optional(),
            whatsapp: z.string().min(10, "O telefone deve ter ao mínimo 10 dígitos").optional(),
            email: z.email("Digite um e-mail válido").optional(),
        })
        .catchall(z.string().min(1, "O campo deve ser preenchido"))
        .refine(
            dados =>
                Object.values(dados).some(
                    v => typeof v === "string" && v.trim() !== ""
                ),
            {
                message: "Informe ao menos um campo para atualização.",
            }
        ),
});