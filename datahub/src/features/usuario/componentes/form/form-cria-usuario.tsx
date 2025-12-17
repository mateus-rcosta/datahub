"use client";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { usuarioSchema } from "@/features/usuario/schema/usuario-schema";
import { criaUsuarioAction } from "../../actions/cria-usuario";
import { useAcaoAutenticada } from "@/hooks/use-acao-autenticada";
import { UsuarioErrorType } from "../../exceptions/usuario-error";
import FormUsuarioBase from "./form-usuario-base";
import z from "zod";

interface FormCriarUsuarioProps {
  onClose: () => void;
}

const MESSAGENS_ERRO: Partial<Record<UsuarioErrorType, string>> = {
  [UsuarioErrorType.EMAIL_EM_USO]: "O e-mail está em uso.",
} as const;

export default function FormCriarUsuario({ onClose }: FormCriarUsuarioProps) {
  const form = useForm<z.infer<typeof usuarioSchema>>({
    resolver: zodResolver(usuarioSchema),
    mode: "onChange",
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      admin: false,
      permissoes: {
        editar_base_dados: false,
        visualizar_relatorios: false,
        editar_campanhas: false,
        editar_integracoes: false,
      }
    },
  });

  const { execute: criaUsuario, isExecuting } = useAcaoAutenticada(
    criaUsuarioAction,
    {
      invalidateQueries: [["usuarios"]],
      onSuccess: () => {
        toast.success("Usuário criado com sucesso.");
        form.reset();
        onClose();
      },
      onError: ({ serverError, validationErrors}) => {

        if (validationErrors) {
          toast.error("Erro ao criar usuário: verifique se os dados estão corretos.");
          return;
        }

        if (serverError) {
          const mensagemErro =
            MESSAGENS_ERRO[serverError as UsuarioErrorType] ?? "Erro desconhecido";

          toast.error("Erro ao criar usuário: " + mensagemErro);
        }
      }
    }
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    await criaUsuario(data);
  });

  return (
    <FormUsuarioBase
      form={form as UseFormReturn<z.infer<typeof usuarioSchema>>}
      onSubmit={handleSubmit}
      onClose={onClose}
      isLoading={isExecuting}
      isEditMode={false}
      schema={usuarioSchema}
    />
  );
}