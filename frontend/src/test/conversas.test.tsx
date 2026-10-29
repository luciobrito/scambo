import { describe, expect, it } from "vitest";
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from "react-router";
import Conversas from "../pages/Conversas/Conversas";
import { quandoConversa } from "../services/chat";

function renderizar() {
    render(<MemoryRouter><Conversas /></MemoryRouter>);
}

const lista = () => screen.getByRole('complementary');
const conversaAberta = () => screen.getByRole('region', { name: "Conversa aberta" });

describe('Tela de chat', () => {
    it('Deve listar as conversas e abrir a mais recente', async () => {
        renderizar();
        expect(await within(lista()).findByText("Ana Souza")).toBeInTheDocument();
        expect(within(lista()).getAllByRole('button', { name: /Souza|Lima|Costa|Alves/ })).toHaveLength(4);
        expect(await within(conversaAberta()).findByText("Posso mandar foto agora mesmo")).toBeInTheDocument();
    });

    it('Deve filtrar as conversas pela busca', async () => {
        renderizar();
        await within(lista()).findByText("Ana Souza");
        await userEvent.type(screen.getByLabelText("Buscar conversa"), "xicaras");
        expect(within(lista()).getByText("Carlos Lima")).toBeInTheDocument();
        expect(within(lista()).queryByText("Ana Souza")).not.toBeInTheDocument();
    });

    it('Deve abrir outra conversa e zerar as não lidas', async () => {
        renderizar();
        await within(lista()).findByText("Maria Costa");
        expect(within(lista()).getByLabelText("1 não lidas")).toBeInTheDocument();
        await userEvent.click(within(lista()).getByText("Maria Costa"));
        expect(await within(conversaAberta()).findByText("Você tem interesse em troca por livros?")).toBeInTheDocument();
        expect(within(lista()).queryByLabelText("1 não lidas")).not.toBeInTheDocument();
    });

    it('Deve enviar uma mensagem', async () => {
        renderizar();
        await within(conversaAberta()).findByText("Posso mandar foto agora mesmo");
        const enviar = screen.getByRole('button', { name: "Enviar mensagem" });
        expect(enviar).toBeDisabled();
        await userEvent.type(screen.getByLabelText("Mensagem"), "Pode mandar sim!{Enter}");
        const balao = await within(conversaAberta()).findByText("Pode mandar sim!");
        expect(balao.closest('[class*="linhaMinha"]')).not.toBeNull();
        expect(screen.getByLabelText("Mensagem")).toHaveValue("");
    });
});

describe('Formatação do horário da conversa', () => {
    const agora = new Date(2026, 9, 28, 15, 0);
    it('Deve formatar conforme a distância', () => {
        expect(quandoConversa(new Date(2026, 9, 28, 14, 32).toISOString(), agora)).toBe("14:32");
        expect(quandoConversa(new Date(2026, 9, 27, 9, 0).toISOString(), agora)).toBe("ontem");
        expect(quandoConversa(new Date(2026, 9, 26, 9, 0).toISOString(), agora)).toBe("seg");
        expect(quandoConversa(new Date(2026, 8, 12, 9, 0).toISOString(), agora)).toBe("12/09");
    });
});
