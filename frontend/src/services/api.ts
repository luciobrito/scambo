import axios, { isAxiosError, isCancel } from "axios";

/*
 * Cliente HTTP único da aplicação.
 *
 * Todos os serviços (anuncios, usuario, chat) fazem as chamadas por aqui, para que URL base,
 * timeout, autenticação e tratamento de erro fiquem num lugar só.
 *
 * Contrato de erro esperado do back-end (docs/CONTRATO_API.md):
 *   status HTTP adequado (400, 401, 404, 409, 500...) e, quando houver texto para o usuário,
 *   corpo { "mensagem": "..." }. Essa mensagem é exibida como está nas telas.
 */
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10_000,
});

// TODO(back-end): autenticação (docs/GUIA_BACKEND.md, seção 4, item 1). Com JWT, por exemplo:
//   api.interceptors.request.use(config => {
//       const token = sessao.obterToken();
//       if (token) config.headers.Authorization = `Bearer ${token}`;
//       return config;
//   });
// e, no interceptor de resposta abaixo, tratar 401 limpando a sessão e levando ao /login.

/** Erro de API já traduzido para exibição: status HTTP (quando houver) e mensagem para o usuário. */
export class ErroApi extends Error {
    readonly status?: number;

    constructor(mensagem: string, status?: number) {
        super(mensagem);
        this.name = "ErroApi";
        this.status = status;
    }
}

const MENSAGENS_POR_STATUS: Record<number, string> = {
    400: "Os dados enviados são inválidos.",
    401: "Sua sessão expirou. Entre novamente.",
    403: "Você não tem permissão para esta ação.",
    404: "O conteúdo não foi encontrado.",
    409: "Esta ação conflita com dados já existentes.",
};

export function paraErroApi(erro: unknown): ErroApi {
    if (erro instanceof ErroApi) return erro;
    if (!isAxiosError(erro)) return new ErroApi("Ocorreu um erro inesperado.");
    if (!erro.response) return new ErroApi("Não foi possível conectar ao servidor.");

    const { status, data } = erro.response;
    const mensagem = (data as { mensagem?: unknown } | undefined)?.mensagem;
    if (typeof mensagem === "string" && mensagem.trim()) return new ErroApi(mensagem, status);
    return new ErroApi(MENSAGENS_POR_STATUS[status] ?? "Ocorreu um erro no servidor. Tente novamente.", status);
}

// Cancelamentos (AbortController) seguem como estão; os demais erros viram ErroApi.
api.interceptors.response.use(
    resposta => resposta,
    erro => Promise.reject(isCancel(erro) ? erro : paraErroApi(erro))
);

/*
 * Liga/desliga os dados de exemplo (services/mocks/) por módulo, pelo frontend/.env.
 * Sem a variável, o mock fica ligado. Quando o back-end entregar os endpoints de um módulo,
 * basta definir a variável como "false" para as telas passarem a usar a API real.
 */
export const usarMock = {
    usuario: import.meta.env.VITE_MOCK_USUARIO !== "false",
    chat: import.meta.env.VITE_MOCK_CHAT !== "false",
};
