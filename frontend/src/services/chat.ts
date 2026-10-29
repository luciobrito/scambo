import { conversasMock, mensagensMock } from "./mocks/chat.mock";
import type { StatusScambo } from "./usuario";

/*
 * Serviço do chat (conversas e mensagens).
 *
 * O back-end do chat ainda está no início (ChatController devolve textos fixos e o
 * HubMensagens envia para todos os clientes). Por enquanto as funções usam os dados
 * de ./mocks/chat.mock.ts. Quando os endpoints existirem, troque o corpo de cada
 * função pela chamada indicada no TODO — as telas não precisam mudar.
 * O formato esperado está em docs/CONTRATO_API.md (na raiz do repositório).
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

export async function listarConversas(): Promise<Conversa[]> {
    // TODO(back-end): GET api/chat/conversas
    // return (await axios.get<Conversa[]>(import.meta.env.VITE_API_URL + "api/chat/conversas")).data;
    return conversasMock.map(c => ({ ...c }));
}

export async function listarMensagens(conversaId: number): Promise<Mensagem[]> {
    // TODO(back-end): GET api/chat/mensagens/{idConversa}  (rota já existe no ChatController)
    // return (await axios.get<Mensagem[]>(import.meta.env.VITE_API_URL + `api/chat/mensagens/${conversaId}`)).data;
    return [...(mensagensMock[conversaId] ?? [])];
}

export async function enviarMensagem(conversaId: number, remetenteId: number, conteudo: string): Promise<Mensagem> {
    // TODO(back-end): POST api/chat/enviar  { conversaId, conteudo }  (rota já existe no ChatController)
    // O remetente deve vir da sessão no back-end; remetenteId só é usado pelo mock.
    // return (await axios.post<Mensagem>(import.meta.env.VITE_API_URL + "api/chat/enviar", { conversaId, conteudo })).data;
    const mensagem: Mensagem = {
        id: Date.now(), conversaId, remetenteId, conteudo,
        dataHora: new Date().toISOString(), visualizada: false
    };
    (mensagensMock[conversaId] ??= []).push(mensagem);
    const conversa = conversasMock.find(c => c.id === conversaId);
    if (conversa) conversa.ultimaMensagem = mensagem;
    return mensagem;
}

export async function marcarComoLida(conversaId: number): Promise<void> {
    // TODO(back-end): PUT api/chat/mensagens/{idConversa}/visualizadas
    const conversa = conversasMock.find(c => c.id === conversaId);
    if (conversa) conversa.naoLidas = 0;
}

/*
 * Recebe mensagens novas da conversa em tempo real. Retorna a função para cancelar.
 * TODO(back-end): usar o HubMensagens (SignalR, /hubmensagens):
 *   conexão.invoke("EntrarConversa", conversaId);
 *   conexão.on("ReceberMensagem", (m: Mensagem) => { if (m.conversaId === conversaId) aoReceber(m); });
 *   cancelar: conexão.invoke("SairConversa", conversaId) e conexão.off("ReceberMensagem").
 * Hoje o hub envia uma string para todos os clientes, por isso o mock não recebe nada.
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
