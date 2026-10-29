import { api, usarMock } from "./api";
import { conversasMock, mensagensMock } from "./mocks/chat.mock";
import type { StatusScambo } from "./usuario";

/*
 * Serviço do chat (tela /app/chat): conversas, mensagens e tempo real.
 *
 * Situação: o ChatController ainda devolve textos fixos e o HubMensagens envia para todos os
 * clientes, então o padrão é usar os dados de ./mocks/chat.mock.ts. As chamadas REST reais já
 * estão implementadas abaixo; para usá-las, defina VITE_MOCK_CHAT=false no frontend/.env.
 *
 * Regras que o back-end deve garantir:
 * - Só devolver conversas e mensagens das quais o usuário logado participa (senão 403/404).
 * - O id da mensagem deve ser o mesmo na resposta REST e no evento do SignalR: a tela usa o id
 *   para não exibir a mesma mensagem duas vezes.
 * Formatos em docs/CONTRATO_API.md, seção "Chat"; os tipos abaixo são a referência do contrato.
 */

export interface Conversa {
    id: number,
    contato: {
        id: number,
        nome: string,
        online: boolean
    },
    // Anúncio que originou a conversa.
    anuncio: {
        id: number,
        titulo: string,
        imagemUrl?: string
    },
    // Status do scambo combinado na conversa; null quando ainda não há scambo.
    statusScambo: StatusScambo | null,
    ultimaMensagem: Mensagem | null,
    naoLidas: number
}

export interface Mensagem {
    id: number,
    conversaId: number,
    remetenteId: number,
    conteudo: string,
    // Data ISO 8601.
    dataHora: string,
    visualizada: boolean
}

// TODO(back-end): GET api/chat/conversas -> 200 Conversa[] do usuário logado | 401.
export async function listarConversas(): Promise<Conversa[]> {
    if (usarMock.chat) return conversasMock.map(c => ({ ...c }));
    const { data } = await api.get<Conversa[]>("api/chat/conversas");
    return data;
}

// TODO(back-end): GET api/chat/mensagens/{idConversa} -> 200 Mensagem[] | 403/404.
// A rota já existe no ChatController, mas devolve texto fixo.
export async function listarMensagens(conversaId: number): Promise<Mensagem[]> {
    if (usarMock.chat) return [...(mensagensMock[conversaId] ?? [])];
    const { data } = await api.get<Mensagem[]>(`api/chat/mensagens/${conversaId}`);
    return data;
}

// TODO(back-end): POST api/chat/enviar { conversaId, conteudo } -> 201 Mensagem | 400 | 403.
// O remetente vem da sessão; `remetenteId` é usado só pelo mock e não é enviado à API.
// Depois de salvar, emitir a mensagem no SignalR para a outra pessoa (ver assinarMensagens).
export async function enviarMensagem(conversaId: number, remetenteId: number, conteudo: string): Promise<Mensagem> {
    if (!usarMock.chat) {
        const { data } = await api.post<Mensagem>("api/chat/enviar", { conversaId, conteudo });
        return data;
    }
    const mensagem: Mensagem = {
        id: Date.now(), conversaId, remetenteId, conteudo,
        dataHora: new Date().toISOString(), visualizada: false
    };
    (mensagensMock[conversaId] ??= []).push(mensagem);
    const conversa = conversasMock.find(c => c.id === conversaId);
    if (conversa) conversa.ultimaMensagem = mensagem;
    return mensagem;
}

// TODO(back-end): PUT api/chat/mensagens/{idConversa}/visualizadas -> 204.
// Deve ser idempotente: a tela chama ao abrir a conversa e não repete em caso de falha.
export async function marcarComoLida(conversaId: number): Promise<void> {
    if (!usarMock.chat) {
        await api.put(`api/chat/mensagens/${conversaId}/visualizadas`);
        return;
    }
    const conversa = conversasMock.find(c => c.id === conversaId);
    if (conversa) conversa.naoLidas = 0;
}

/*
 * Recebe mensagens novas da conversa em tempo real. Retorna a função para cancelar.
 *
 * TODO(back-end): ainda não implementado, porque o hub atual envia uma string para todos os
 * clientes. Contrato proposto (docs/CONTRATO_API.md, seção "Tempo real"):
 *   conexão.invoke("EntrarConversa", conversaId);           // servidor adiciona ao grupo da conversa
 *   conexão.on("ReceberMensagem", (m: Mensagem) => { if (m.conversaId === conversaId) aoReceber(m); });
 *   cancelar: conexão.invoke("SairConversa", conversaId) e conexão.off("ReceberMensagem").
 * A conexão deve ser única para a aplicação (não uma por conversa) e autenticada como a API.
 * Até lá, as mensagens da outra pessoa só aparecem ao reabrir a conversa.
 */
export function assinarMensagens(conversaId: number, aoReceber: (mensagem: Mensagem) => void): () => void {
    void conversaId;
    void aoReceber;
    return () => { };
}

const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

// "14:32"
export function horaCurta(dataIso: string) {
    const data = new Date(dataIso);
    return `${String(data.getHours()).padStart(2, "0")}:${String(data.getMinutes()).padStart(2, "0")}`;
}

// Hoje: "14:32"; ontem: "ontem"; última semana: "seg"; antes disso: "12/09".
export function quandoConversa(dataIso: string, agora = new Date()) {
    const data = new Date(dataIso);
    const inicioDoDia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dias = Math.round((inicioDoDia(agora) - inicioDoDia(data)) / 86400000);
    if (dias <= 0) return horaCurta(dataIso);
    if (dias === 1) return "ontem";
    if (dias < 7) return DIAS_SEMANA[data.getDay()];
    return `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}`;
}
