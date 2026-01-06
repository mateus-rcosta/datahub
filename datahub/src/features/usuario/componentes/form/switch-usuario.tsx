"use client";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { UsuarioErrorType } from "../../exceptions/usuario-error";
import { alteraStatusUsuarioAction } from "../../actions/altera-status-usuario";
import { getQueryClient } from "@/lib/react-query";
import { useAcaoAutenticada } from "@/hooks/use-acao-autenticada";

type Props = {
    id: string;
    nome: string;
    ativo: boolean;
};

const MESSAGENS_ERRO: Partial<Record<UsuarioErrorType, string>> = {
    [UsuarioErrorType.USUARIO_NAO_ENCONTRADO]: "Não encontrado o usuário para alterar o status de acesso.",
    [UsuarioErrorType.USUARIO_NAO_PODE_SE_EXCLUIR]: "O usuário não pode se inativar.",
} as const;

export default function SwitchUsuario({ id, ativo, nome }: Props) {

    const query = getQueryClient();

    const { execute, isExecuting } = useAcaoAutenticada(alteraStatusUsuarioAction, {
        invalidateQueries: [["usuarios"]],
        onSuccess: () => {
            query.invalidateQueries({ queryKey: ['usuarios'] });
            toast.success(`Alterado o status com sucesso do usuário: ${nome}`);
        },
        onError: ({ serverError, validationErrors, thrownError: error }) => {
            if (validationErrors) {
                toast.error("Erro ao mudar o status de acesso. Tente novamente mais tarde.");
            }
            if (serverError) {
                const mensagemErro = MESSAGENS_ERRO[serverError as UsuarioErrorType] || "Erro desconhecido";
                toast.error("Erro ao mudar o status de acesso: " + mensagemErro);
            }
        }
    });

    const onSubmit = () => {
        execute({ id });
    };

    return (
        <Switch
            checked={ativo}
            onCheckedChange={onSubmit}
            disabled={isExecuting}
            className="max-w-8"
        />
    );
}