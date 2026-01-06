"use client";
import { useEffect, useMemo } from "react";
import { Control, UseFormReturn } from "react-hook-form";
import { Database, File, Loader2, Send, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { SwitchInput, TextInput } from "@/components/layout/form/form";
import z from "zod";
import { editarSchema, usuarioSchema } from "../../schema/usuario-schema";

interface FormUsuarioBaseProps {
  form: UseFormReturn<z.infer<typeof editarSchema>> | UseFormReturn<z.infer<typeof usuarioSchema>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isLoading: boolean;
  isEditMode: boolean;
  schema: z.ZodObject;
}

export default function FormUsuarioBase({
  form,
  onSubmit,
  onClose,
  isLoading,
  isEditMode,
  schema
}: FormUsuarioBaseProps) {
  const admin = form.watch().admin;
  const { isDirty, isValid } = form.formState;

  useEffect(() => {
    if (admin) {
      form.setValue("permissoes.editar_base_dados", true);
      form.setValue("permissoes.editar_campanhas", true);
      form.setValue("permissoes.editar_integracoes", true);
      form.setValue("permissoes.visualizar_relatorios", true);
    }
  }, [admin, form]);

  const permissoesSistema = useMemo(
    () => ({
      editar_base_dados: {
        id: "permissoes.editar_base_dados",
        nome: "Editar base de dados",
        descricao: "Permite criar, editar e excluir registros da base de dados.",
        icon: <Database className="h-5 w-5" />,
      },
      visualizar_relatorios: {
        id: "permissoes.visualizar_relatorios",
        nome: "Visualizar relatórios",
        descricao: "Permite acessar e gerar relatórios do sistema.",
        icon: <File className="h-5 w-5" />,
      },
      editar_campanhas: {
        id: "permissoes.editar_campanhas",
        nome: "Editar campanhas",
        descricao: "Permite criar, editar e excluir campanhas.",
        icon: <Send className="h-5 w-5" />,
      },
      editar_integracoes: {
        id: "permissoes.editar_integracoes",
        nome: "Editar integrações",
        descricao: "Permite configurar e gerenciar integrações com sistemas externos.",
        icon: <Settings className="h-5 w-8" />,
      },
    }),
    []
  );

  return (
    <form onSubmit={onSubmit}>
      <FieldSet >
        <div className="flex items-center gap-2 text-black dark:text-gray-100">
          <Shield className="h-5 w-5 " />
          <h3 className="text-lg font-semibold ">Informações Básicas</h3>
        </div>
        <FieldGroup className="flex-col md:flex-row">
          <TextInput
            label="Nome"
            type="text"
            name="nome"
            control={form.control as unknown as Control<z.infer<typeof schema>>}
          />
          <SwitchInput
            label="Administrador"
            name="admin"
            control={form.control as unknown as Control<z.infer<typeof schema>>}
          />
        </FieldGroup>
        <FieldGroup className="flex-col md:flex-row">
          <TextInput
            label="E-mail"
            type="email"
            name="email"
            control={form.control as unknown as Control<z.infer<typeof schema>>}
            disabled={isEditMode}
          />
          <TextInput
            label={isEditMode ? "Nova Senha (opcional)" : "Senha"}
            type="password"
            name="senha"
            control={form.control as unknown as Control<z.infer<typeof schema>>}
            placeholder={isEditMode ? "Deixe em branco para manter a atual" : ""}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet className="mt-8">
        <div className="flex justify-between items-center gap-4">
          <h3 className="text-lg font-semibold text-black dark:text-gray-100">Permissões do Sistema</h3>
          {admin && (
            <div className="flex gap-2 bg-primary text-white items-center px-2 pt-0.5 pb-1 rounded-lg">
              <Shield className="h-5 w-5" />
              <span>Administrador - Todas as permissões</span>
            </div>
          )}
        </div>
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {Object.entries(permissoesSistema).map(([key, permissao]) => (
            <div key={key} className="flex items-center justify-between border rounded-lg p-1 shadow-xs bg-white dark:bg-secondary">
              <div className="flex items-center gap-3 p-3">
                <div className="flex-1 items-start justify-start h-full text-black dark:text-gray-100">{permissao.icon}</div>
                <SwitchInput
                  label={permissao.nome}
                  description={permissao.descricao}
                  name={permissao.id as string}
                  control={form.control as unknown as Control<z.infer<typeof schema>>}
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
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-white"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 font-semibold"
          disabled={isLoading || !isDirty || !isValid}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? "Atualizar" : "Criar"} Usuário
        </Button>
      </div>
    </form>
  );
}