import { IntegracaoDados } from "@/types/types";
import { UpchatForm } from "./upchat-form";

export const integrationForms = {
    "Upchat": UpchatForm,
} as const;

export interface FormHandle {
    submit: () => void;
}

export interface FormStatus {
    isDirty: boolean;
    isValid: boolean;
    isExecuting: boolean;
}


export interface BaseFormProps {
    config: IntegracaoDados;
    integracaoId: number;
    onStatusChange: (status: FormStatus) => void;
}
