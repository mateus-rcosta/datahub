"use client";

import { Switch } from "@/components/ui/switch";
import { useToggleStatusUsuario } from "../../api/toggleStatusUsuario";
import { toast } from "sonner";
import { UserErrorType } from "../../exceptions/UserError";

type Props = {
    id: number;
    nome: string;
    ativo: boolean;
};

export default function SwitchUsuario({ id, ativo, nome }: Props) {
    const { toggleStatusUsuario } = useToggleStatusUsuario();


    const onCheckedChangeSubmit = async () => {
        const resultado = await toggleStatusUsuario(id);
        if (resultado.success) {
            toast.success(`Alterado o status com sucesso do usuário: ${nome}`);
        }
        if (!resultado.success) {
            if (resultado.code === UserErrorType.ADMIN_NAO_PODE_SER_ALTERADO) {
                toast.error("Erro ao mudar o status de acesso: usuário SUPERADMIN não pode ter o status alterado.");
                return;
            }
            if (resultado.code === UserErrorType.USUARIO_NAO_PODE_SE_EXCLUIR) {
                toast.error("Erro ao mudar o status de acesso: você não pode mudar o seu status.");
                return;
            }

            toast.error("Erro ao deletar: erro desconhecido.");
            return;
        }
    }

    return (
        <Switch
            checked={ativo}
            onCheckedChange={onCheckedChangeSubmit}
            className="max-w-8 data-[state=unchecked]:bg-black"
        />
    );
}
