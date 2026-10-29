import { describe, expect, it, vi } from "vitest";
import { AxiosError, type AxiosResponse } from "axios";
import { ErroApi, paraErroApi } from "../services/api";

function erroHttp(status: number, data?: unknown) {
    return new AxiosError("falha", "ERR_BAD_RESPONSE", undefined, undefined, { status, data } as AxiosResponse);
}

describe('Tradução de erros da API', () => {
    it('Deve usar a mensagem enviada pelo back-end', () => {
        const erro = paraErroApi(erroHttp(409, { mensagem: "E-mail já cadastrado." }));
        expect(erro).toBeInstanceOf(ErroApi);
        expect(erro.message).toBe("E-mail já cadastrado.");
        expect(erro.status).toBe(409);
    });

    it('Deve usar uma mensagem padrão quando o corpo não tem mensagem', () => {
        expect(paraErroApi(erroHttp(404)).message).toBe("O conteúdo não foi encontrado.");
        expect(paraErroApi(erroHttp(500, "texto qualquer")).message).toBe("Ocorreu um erro no servidor. Tente novamente.");
    });

    it('Deve identificar falha de conexão', () => {
        expect(paraErroApi(new AxiosError("Network Error", "ERR_NETWORK")).message).toBe("Não foi possível conectar ao servidor.");
    });
});

describe('Serviços com a API real (mocks desligados)', () => {
    it('Deve chamar os endpoints do contrato', async () => {
        vi.resetModules();
        vi.doMock("../services/api", async (importOriginal) => {
            const original = await importOriginal<typeof import("../services/api")>();
            return { ...original, usarMock: { usuario: false, chat: false } };
        });
        const { api } = await import("../services/api");
        const get = vi.spyOn(api, "get").mockResolvedValue({ data: [] });
        const post = vi.spyOn(api, "post").mockResolvedValue({ data: { id: 1 } });

        const { obterUsuarioLogado } = await import("../services/usuario");
        const { listarMensagens, enviarMensagem } = await import("../services/chat");
        await obterUsuarioLogado();
        await listarMensagens(7);
        await enviarMensagem(7, 99, "Olá");

        expect(get).toHaveBeenCalledWith("api/usuarios/me");
        expect(get).toHaveBeenCalledWith("api/chat/mensagens/7");
        // O remetente vem da sessão no back-end; não deve ser enviado.
        expect(post).toHaveBeenCalledWith("api/chat/enviar", { conversaId: 7, conteudo: "Olá" });
        vi.doUnmock("../services/api");
    });
});
