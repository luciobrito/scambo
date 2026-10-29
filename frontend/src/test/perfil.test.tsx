import { describe, expect, it } from "vitest";
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from "react-router";
import Perfil from "../pages/Perfil/Perfil";
import { mesAno } from "../services/usuario";

function renderizar() {
    render(
        <MemoryRouter initialEntries={["/app/profile"]}>
            <Routes>
                <Route path="/app/profile" element={<Perfil />} />
                <Route path="/login" element={<p>Tela de login</p>} />
            </Routes>
        </MemoryRouter>
    );
}

describe('Tela de perfil', () => {
    it('Deve exibir os dados do perfil', async () => {
        renderizar();
        expect(await screen.findByRole('heading', { name: "Lucas Ferreira" })).toBeInTheDocument();
        expect(screen.getByText("@lucasferreira · São Paulo, SP")).toBeInTheDocument();
        expect(screen.getByText("Membro desde jan 2025")).toBeInTheDocument();
        expect(screen.getByText("4.9 ★")).toBeInTheDocument();
        expect(screen.getByText("com Maria Costa · ago 2026")).toBeInTheDocument();
        expect(screen.getByText("Scambo Ativo")).toBeInTheDocument();
    });

    it('Deve editar e salvar a bio', async () => {
        renderizar();
        await screen.findByRole('heading', { name: "Lucas Ferreira" });
        await userEvent.click(screen.getByRole('button', { name: "Editar" }));
        const campo = screen.getByRole('textbox', { name: "Sobre mim" });
        await userEvent.clear(campo);
        await userEvent.type(campo, "Nova bio");
        await userEvent.click(screen.getByRole('button', { name: "Salvar" }));
        expect(await screen.findByText("Nova bio")).toBeInTheDocument();
        expect(screen.queryByRole('textbox', { name: "Sobre mim" })).not.toBeInTheDocument();
    });

    it('Deve voltar para o login ao sair', async () => {
        renderizar();
        await screen.findByRole('heading', { name: "Lucas Ferreira" });
        const cabecalho = screen.getByRole('banner');
        await userEvent.click(within(cabecalho).getByRole('button', { name: "Sair" }));
        expect(screen.getByText("Tela de login")).toBeInTheDocument();
    });
});

describe('Formatação de datas', () => {
    it('Deve formatar mês e ano', () => {
        expect(mesAno("2026-08-10T00:00:00Z")).toBe("ago 2026");
        expect(mesAno("invalida")).toBe("");
    });
});
