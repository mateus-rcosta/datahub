import { IntegracaoNome, IntegracaoStrategy } from "@/types/types";
import { ixcSchema, upchatSchema, wifeedSchema } from "./schema/integracao";
import { upchatHealthcheck } from "./services/healthchecks/upchat-healthchek";
import { wifeedHealthcheck } from "./services/healthchecks/wifeed-healthcheck";
import { ixcHealthcheck } from "./services/healthchecks/ixc-healthcheck";

export const INTEGRACOES: Record<IntegracaoNome, IntegracaoStrategy> = {
    UPCHAT: {
        label: "Upchat",
        descricao: "Plataforma OmniChannel e CRM",
        schema: upchatSchema,
        healthcheck: upchatHealthcheck,
        camposSensiveis: ['apiKey'],
    },
    WIFEED:{
      label: "WiFeed",
      descricao: "Plataforma de Hotspots",
      schema: wifeedSchema,
      healthcheck: wifeedHealthcheck,
      camposSensiveis: ['clientSecret'],
    },
    IXC: {
      label: "IXC",
      descricao: "Plataforma ERP",
      schema: ixcSchema,
      healthcheck: ixcHealthcheck,
      camposSensiveis: ['token'],
    },
};