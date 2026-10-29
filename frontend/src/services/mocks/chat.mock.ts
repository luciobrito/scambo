import type { Conversa, Mensagem } from "../chat";
import { usuarioLogadoMock } from "./usuario.mock";

/*
 * Dados provisórios usados enquanto o back-end do chat não existe.
 * Seguem exatamente os tipos de ../chat.ts (o contrato com a API).
 * As datas são relativas ao momento atual para a lista parecer recente.
 * Remover este arquivo quando os endpoints estiverem prontos.
 */

const EU = usuarioLogadoMock.id;

function minutosAtras(minutos: number) {
    return new Date(Date.now() - minutos * 60000).toISOString();
}

function mensagem(id: number, conversaId: number, remetenteId: number, conteudo: string, minutos: number): Mensagem {
    return { id, conversaId, remetenteId, conteudo, dataHora: minutosAtras(minutos), visualizada: true };
}

export const mensagensMock: Record<number, Mensagem[]> = {
    1: [
        mensagem(1, 1, 2, "Oi! Tenho interesse na sua cesta artesanal 🌿", 9),
        mensagem(2, 1, EU, "Olá! Que ótimo! A cesta ainda está disponível.", 8),
        mensagem(3, 1, 2, "Você aceitaria trocar por um kit de livros de design?", 7),
        mensagem(4, 1, EU, "Que combinação incrível! Manda uma foto dos livros?", 6),
        mensagem(5, 1, 2, "Claro! São 3 livros sobre design gráfico, quase novos 📚", 5),
        mensagem(6, 1, 2, "Posso mandar foto agora mesmo", 5),
    ],
    2: [
        mensagem(7, 2, EU, "As xícaras ainda estão disponíveis, pode vir buscar.", 150),
        mensagem(8, 2, 3, "Combinado! Posso buscar amanhã.", 140),
    ],
    3: [
        mensagem(9, 3, 4, "Você tem interesse em troca por livros?", 26 * 60),
    ],
    4: [
        mensagem(10, 4, EU, "Foi um prazer! Aproveite o vaso.", 3 * 24 * 60 + 10),
        mensagem(11, 4, 5, "Obrigado pelo scambo! 😊", 3 * 24 * 60),
    ],
};

function ultima(conversaId: number) {
    const lista = mensagensMock[conversaId];
    return lista[lista.length - 1];
}

export const conversasMock: Conversa[] = [
    {
        id: 1, contato: { id: 2, nome: "Ana Souza", online: true },
        anuncio: { id: 1, titulo: "Cesta Artesanal Trançada", imagemUrl: "https://images.unsplash.com/photo-1760647832573-969bf71d12b8?w=80&h=80&fit=crop" },
        statusScambo: "Em andamento", ultimaMensagem: ultima(1), naoLidas: 2
    },
    {
        id: 2, contato: { id: 3, nome: "Carlos Lima", online: false },
        anuncio: { id: 2, titulo: "Xícaras de Cerâmica", imagemUrl: "https://images.unsplash.com/photo-1763824371988-8c8eb3d13eff?w=80&h=80&fit=crop" },
        statusScambo: "Em andamento", ultimaMensagem: ultima(2), naoLidas: 0
    },
    {
        id: 3, contato: { id: 4, nome: "Maria Costa", online: true },
        anuncio: { id: 3, titulo: "Cestos Coloridos", imagemUrl: "https://images.unsplash.com/photo-1768102365363-d20d185b331e?w=80&h=80&fit=crop" },
        statusScambo: null, ultimaMensagem: ultima(3), naoLidas: 1
    },
    {
        id: 4, contato: { id: 5, nome: "João Alves", online: false },
        anuncio: { id: 4, titulo: "Vaso de Barro Rústico", imagemUrl: "https://images.unsplash.com/photo-1590605105526-5c08f63f89aa?w=80&h=80&fit=crop" },
        statusScambo: "Concluído", ultimaMensagem: ultima(4), naoLidas: 0
    },
];
