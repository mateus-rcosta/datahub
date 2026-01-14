import { IntegracaoDados } from "@/types/types";
import { UpchatForm } from "./upchat-form";
import { WifeedForm } from "./wifeed-form";
import { IxcForm } from "./ixc-form";

export const integrationForms = {
    "UPCHAT": UpchatForm,
    "WIFEED": WifeedForm,
    "IXC": IxcForm
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
    integracaoNome: "UPCHAT" | "WIFEED" | "IXC";
    onStatusChange: (status: FormStatus) => void;
}
