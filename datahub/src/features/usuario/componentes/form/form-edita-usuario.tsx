"use client";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { editarSchema, usuarioSchema } from "@/features/usuario/schema/usuario-schema";
import { atualizaUsuarioAction } from "../../actions/atualiza-usuario";
import { useAcaoAutenticada } from "@/hooks/use-acao-autenticada";
import { UsuarioErrorType } from "../../exceptions/usuario-error";
import { Usuario } from "@/types/types";
import FormUsuarioBase from "./form-usuario-base";
import z from "zod";

interface FormEditarUsuarioProps {
  usuario: Usuario;
  onClose: () => void;
}

const MESSAGENS_ERRO: Partial<Record<UsuarioErrorType, string>> = {
  [UsuarioErrorType.ADMIN_NAO_PODE_SER_ALTERADO]: "Usuário SUPERADMIN não pode ser alterado",
  [UsuarioErrorType.EMAIL_EM_USO]: "O e-mail está em uso.",
} as const;

// Schema para o formulário (sem id, ativo)
const editarFormSchema = usuarioSchema.omit({ senha: true }).extend({
  senha: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, { message: "A senha deve ter no mínimo 8 caracteres" })
    .refine((val) => !val || val.length <= 50, { message: "A senha deve ter no máximo 50 caracteres" })
    .refine((val) => !val || /[A-Z]/.test(val), { message: "A senha deve conter ao menos uma letra maiúscula" })
    .refine((val) => !val || /[a-z]/.test(val), { message: "A senha deve conter ao menos uma letra minúscula" })
    .refine((val) => !val || /[0-9]/.test(val), { message: "A senha deve conter ao menos um número" }),
});

export default function FormEditarUsuario({ usuario, onClose }: FormEditarUsuarioProps) {
  const form = useForm<z.infer<typeof editarFormSchema>>({
    resolver: zodResolver(editarFormSchema),
    mode: "onChange",
    defaultValues: {
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      admin: usuario.admin,
      permissoes: {
        editar_base_dados: usuario.permissoes?.editar_base_dados || false,
        visualizar_relatorios: usuario.permissoes?.visualizar_relatorios || false,
        editar_campanhas: usuario.permissoes?.editar_campanhas || false,
        editar_integracoes: usuario.permissoes?.editar_integracoes || false,
      }
    },
  });

  const { execute: atualizaUsuario, isExecuting } = useAcaoAutenticada(
    atualizaUsuarioAction,
    {
      invalidateQueries: [["usuarios"]],
      onSuccess: () => {
        toast.success("Usuário atualizado com sucesso.");
        onClose();
      },
      onError: ({ serverError, validationErrors }) => {
        if (validationErrors) {
          toast.error("Erro ao atualizar usuário: verifique se os dados estão corretos.");
        }
        if (serverError) {
          const mensagemErro = MESSAGENS_ERRO[serverError.code as UsuarioErrorType] || "Erro desconhecido";
          toast.error("Erro ao atualizar usuário: " + mensagemErro);
        }
      }
    }
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    // Prepara os dados com id e ativo para o schema do servidor
    const editData = editarSchema.parse({
      id: usuario.id,
      nome: data.nome,
      email: data.email,
      admin: data.admin,
      permissoes: data.permissoes,
      ...(data.senha && data.senha.trim() !== "" && { senha: data.senha }),
    });

    await atualizaUsuario(editData);
  });

  return (
    <FormUsuarioBase
      form={form as UseFormReturn<z.infer<typeof editarSchema>>}
      onSubmit={handleSubmit}
      onClose={onClose}
      isLoading={isExecuting}
      isEditMode={true}
      schema={editarSchema}
    />
  );
}