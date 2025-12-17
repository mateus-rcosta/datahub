export const apenasNumeros = (valor: string | null | undefined): string => {
    if (!valor) return "";
    return valor.replace(/\D/g, "");
};

export const formataTelefone = (telefone: string | null | undefined): string | null => {
    if (!telefone) return null;

    let numero = telefone.replace(/\D/g, "");

    // Remove prefixos internacionais comuns (ex: 0055)
    if (numero.startsWith("00")) {
        numero = numero.slice(2);
    }

    // Remove código do país se já existir
    if (numero.startsWith("55")) {
        numero = numero.slice(2);
    }

    // Agora deve conter DDD + número
    if (numero.length < 10) return null;

    const ddd = numero.slice(0, 2);
    let telefoneLocal = numero.slice(2);

    // DDD deve ter exatamente 2 dígitos
    if (!/^\d{2}$/.test(ddd)) return null;

    // Se tiver 8 dígitos, adiciona o 9
    if (telefoneLocal.length === 8) {
        telefoneLocal = "9" + telefoneLocal;
    }

    // Validação final: celular deve ter 9 dígitos
    if (telefoneLocal.length !== 9) return null;

    // Monta telefone brasileiro completo
    return `55${ddd}${telefoneLocal}`;
};
