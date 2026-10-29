import { describe, expect, it } from "vitest";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";

function renderizar(rota: string) {
    render(<MemoryRouter initialEntries={[rota]}><Sidebar /></MemoryRouter>);
}

describe('Sidebar', () => {
    it('Deve exibir cabeçalho e o usuário vindo do serviço', async () => {
        renderizar("/app/products");
        expect(screen.getByText("Scambo")).toBeInTheDocument();
        expect(screen.getByText("Comunidade de doações")).toBeInTheDocument();
        expect(await screen.findByText("Lucas Ferreira")).toBeInTheDocument();
        expect(screen.getByText("@lucasferreira")).toBeInTheDocument();
    });

    it('Deve destacar Início na tela de produtos e apontar para as rotas existentes', () => {
        renderizar("/app/products");
        const inicio = screen.getByRole('link', { name: "Início" });
        expect(inicio).toHaveAttribute('aria-current', 'page');
        expect(inicio).toHaveAttribute('href', '/app/products');
        expect(screen.getByRole('link', { name: "Chat" })).toHaveAttribute('href', '/app/chat');
        expect(screen.getByRole('link', { name: "Perfil" })).toHaveAttribute('href', '/app/profile');
    });

    it('Deve deslogar pelo ícone de sair', async () => {
        render(
            <MemoryRouter initialEntries={["/app/products"]}>
                <Routes>
                    <Route path="/app/products" element={<Sidebar />} />
                    <Route path="/login" element={<p>Tela de login</p>} />
                </Routes>
            </MemoryRouter>
        );
        await userEvent.click(screen.getByRole('button', { name: "Sair da conta" }));
        expect(screen.getByText("Tela de login")).toBeInTheDocument();
    });

    it('Deve destacar Perfil na tela de perfil', () => {
        renderizar("/app/profile");
        expect(screen.getByRole('link', { name: "Perfil" })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', { name: "Início" })).not.toHaveAttribute('aria-current');
    });
});
