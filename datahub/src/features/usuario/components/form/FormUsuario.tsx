"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Database, File, Loader2, Send, Settings, Shield } from "lucide-react";

import  { AtualizarUsuarioInput } from "@/features/usuario/action/atualizarUsuario";
import { usuarioEditarSchema, usuarioSchema } from "@/features/usuario/schema/UsuarioSchema";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import z from "zod";
import { SwitchInput, TextInput } from "@/components/layout/form/form";
import { useCreateUsuario } from "../../api/createUsuario";
import { useUpdateUsuario } from "../../api/updateUsuario";
import { UserErrorType } from "../../exceptions/UserError";
import { Usuario } from "@/types/types";

interface CardUsuarioProps {
  usuario?: Usuario;
  onClose: () => void;
}

const inputs = {
  classname: "bg-white",
}

export default function FormUsuario({ usuario, onClose }: CardUsuarioProps) {

  const form = useForm<z.infer<typeof usuarioEditarSchema>>({
    resolver: zodResolver(usuario ? usuarioEditarSchema : usuarioSchema),
    mode: "onChange",
    defaultValues: {
      nome: usuario?.nome || "",
      email: usuario?.email || "",
      senha: "",
      admin: usuario?.admin || false,
      editar_base_dados: usuario?.permissoes?.editar_base_dados || false,
      visualizar_relatorios: usuario?.permissoes?.visualizar_relatorios || false,
      editar_campanhas: usuario?.permissoes?.editar_campanhas || false,
      editar_integracoes: usuario?.permissoes?.editar_integracoes || false,
    },
  });

  const { setError } = form;
  const admin = useWatch({ control: form.control, name: "admin" });
  const { isDirty, isValid } = useFormState({ control: form.control });

  useEffect(() => {
    if (admin) {
      form.setValue("editar_base_dados", true);
      form.setValue("editar_campanhas", true);
      form.setValue("editar_integracoes", true);
      form.setValue("visualizar_relatorios", true);
    }
  }, [admin, form]);

  const permissoesSistema = useMemo(
    () => ({
      editar_base_dados: {
        id: "editar_base_dados",
        nome: "Editar base de dados",
        descricao: "Permite criar, editar e excluir registros da base de dados.",
        icon: <Database className="h-5 w-5 text-black" />,
      },
      visualizar_relatorios: {
        id: "visualizar_relatorios",
        nome: "Visualizar relatórios",
        descricao: "Permite acessar e gerar relatórios do sistema.",
        icon: <File className="h-5 w-5 text-black" />,
      },
      editar_campanhas: {
        id: "editar_campanhas",
        nome: "Editar campanhas",
        descricao: "Permite criar, editar e excluir campanhas.",
        icon: <Send className="h-5 w-5 text-black" />,
      },
      editar_integracoes: {
        id: "editar_integracoes",
        nome: "Editar integrações",
        descricao: "Permite configurar e gerenciar integrações com sistemas externos.",
        icon: <Settings className="h-5 w-8 text-black" />,
      },
    }),
    []
  );


  const { createUsuario, isPending: isCreating } = useCreateUsuario()
  const { updateUsuario, isPending: isEditing } = useUpdateUsuario();

  const handleSubmit = async (data: z.infer<typeof usuarioEditarSchema>) => {
    if (usuario) {
      const resultado = await updateUsuario({ id: usuario.id, ...data } as AtualizarUsuarioInput);

      if (resultado.success) {
        toast.success("Usuário atualizado com sucesso.");
        onClose();
        return;
      }

      if (!resultado.success) {
        if (resultado.code === UserErrorType.ADMIN_NAO_PODE_SER_ALTERADO) {
          toast.error("Erro ao alterar usuário SUPERADMIN não pode ser alterado.");
          return;
        }

        if (resultado.code === UserErrorType.DADOS_INVALIDOS && resultado?.validacao) {
          Object.entries(resultado.validacao).forEach(([field, mensagens]) => {
            setError(field as any, { type: "server", message: mensagens.join(", ") });
          });
          return;
        }

        toast.error("Erro ao editar usuário: erro desconhecido.");
        return;
      }
    }

    if (!usuario) {
      const payload = data as unknown as z.infer<typeof usuarioSchema>;
      const resultado = await createUsuario(payload);

      if (resultado?.success) {
        toast.success("Usuário criado com sucesso.");
        onClose();
        return;
      }
      if (resultado.code) {
        if (resultado.code === UserErrorType.EMAIL_EM_USO) {
          toast.error("Erro ao criar usuário: e-mail em uso.");
          return;
        }
        if (resultado.code === UserErrorType.DADOS_INVALIDOS && resultado?.validacao) {
          Object.entries(resultado.validacao).forEach(([field, mensagens]) => {
            setError(field as any, { type: "server", message: mensagens.join(", ") });
          });
          return;
        }
        toast.error("Erro ao criar usuário: erro desconhecido.");
        return;
      }
    };
  };


  const isSubmitting = isCreating || isEditing;

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldSet>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-black" />
          <h3 className="text-lg font-semibold text-black">Informações Básicas</h3>
        </div>

        <FieldGroup className="flex-row">
          <TextInput className={inputs.classname} label="Nome" type="text" name="nome" control={form.control} />
          <SwitchInput label="Administrador" name="admin" control={form.control} />
        </FieldGroup>

        <FieldGroup className="flex-row">
          <TextInput className={inputs.classname} label="E-mail" type="text" name="email" control={form.control} disabled={!!usuario} />
          <TextInput className={inputs.classname} label="Senha" type="password" name="senha" control={form.control} />
        </FieldGroup>
      </FieldSet>

      <FieldSet className="mt-8">
        <div className="flex justify-between items-center gap-4">
          <h3 className="text-lg font-semibold text-black">Permissões do Sistema</h3>
          {admin && (
            <div className="flex gap-2 bg-primary text-white items-center px-2 pt-0.5 pb-1 rounded-lg">
              <Shield className="h-5 w-5" />
              <span>Administrador - Todas as permissões</span>
            </div>
          )}
        </div>

        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {Object.entries(permissoesSistema).map(([key, permissao]) => (
            <div key={key} className="flex items-center justify-between border rounded-lg p-1 shadow-xs bg-white">
              <div className="flex items-center gap-3 p-3">
                <div className="flex-1 items-start justify-start h-full">{permissao.icon}</div>
                <SwitchInput
                  label={permissao.nome}
                  description={permissao.descricao}
                  name={permissao.id as keyof z.infer<typeof usuarioEditarSchema>}
                  control={form.control}
                  disabled={!!admin}
                />
              </div>
            </div>
          ))}
        </FieldGroup>
      </FieldSet>

      {admin && (
        <div className="rounded-lg mt-2 p-2 border-2 border-blue-300 bg-blue-200">
          <p className="text-blue-600">
            <span className="text-blue-700 font-semibold">Administradores</span> possuem acesso total ao sistema e não podem ter suas permissões individuais modificadas.
          </p>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <Button type="button" variant="outline" className="flex-1 bg-white" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 font-semibold text-lg" disabled={isSubmitting || !isDirty || !isValid}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar
        </Button>
      </div>
    </form>
  );
}
