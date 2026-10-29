import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Produtos from "../pages/Produtos/Produtos";
import { listarAnuncios, paraProduto, tempoDesde, type Produto } from "../services/anuncios";

vi.mock("../services/anuncios", async (importOriginal) => ({
    ...await importOriginal<typeof import("../services/anuncios")>(),
    listarAnuncios: vi.fn()
}));

const listarMock = vi.mocked(listarAnuncios);

const produtos: Produto[] = [
    paraProduto({ id: 1, titulo: "Livro de Tipografia", descricao: "Quase novo", categoria: "livros", localizacao: "Recife, PE", nomeDoador: "Ana" }),
    paraProduto({ id: 2, titulo: "Camiseta Infantil", descricao: "Tamanho 4", categoria: "Roupas" }),
    paraProduto({ id: 3, titulo: "Vaso de Barro", descricao: "Peça artesanal", categoria: "Cerâmica" }),
];

describe('Tela de produtos', () => {
    beforeEach(() => listarMock.mockReset());

    it('Deve listar os produtos retornados pela API', async () => {
        listarMock.mockResolvedValue(produtos);
        render(<Produtos />);
        expect(await screen.findByText("Livro de Tipografia")).toBeInTheDocument();
        expect(screen.getAllByRole('article')).toHaveLength(3);
        expect(screen.getByText("3 itens disponíveis para scambo")).toBeInTheDocument();
    });

    it('Deve filtrar pela busca ignorando acentos', async () => {
        listarMock.mockResolvedValue(produtos);
        render(<Produtos />);
        await screen.findByText("Livro de Tipografia");
        await userEvent.type(screen.getByLabelText("Buscar itens"), "artesanal");
        expect(screen.getAllByRole('article')).toHaveLength(1);
        expect(screen.getByText("Vaso de Barro")).toBeInTheDocument();
    });

    it('Deve filtrar por categoria, tratando categorias desconhecidas como Outros', async () => {
        listarMock.mockResolvedValue(produtos);
        render(<Produtos />);
        await screen.findByText("Livro de Tipografia");
        const categorias = screen.getByRole('group', { name: "Filtrar por categoria" });

        await userEvent.click(within(categorias).getByRole('button', { name: "Livros" }));
        expect(screen.getAllByRole('article')).toHaveLength(1);
        expect(screen.getByText("Livro de Tipografia")).toBeInTheDocument();

        await userEvent.click(within(categorias).getByRole('button', { name: "Outros" }));
        expect(screen.getByText("Vaso de Barro")).toBeInTheDocument();

        await userEvent.click(within(categorias).getByRole('button', { name: "Eletrônicos" }));
        expect(screen.getByText("Nenhum item encontrado")).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: "Limpar filtros" }));
        expect(screen.getAllByRole('article')).toHaveLength(3);
    });

    it('Deve selecionar e cancelar a seleção de um item', async () => {
        listarMock.mockResolvedValue(produtos);
        render(<Produtos />);
        await screen.findByText("Livro de Tipografia");
        await userEvent.click(screen.getAllByRole('button', { name: "Scambo" })[0]);
        const barra = screen.getByRole('region', { name: "Item selecionado para scambo" });
        expect(within(barra).getByText("Livro de Tipografia")).toBeInTheDocument();
        await userEvent.click(within(barra).getByRole('button', { name: "Cancelar" }));
        expect(screen.queryByRole('region', { name: "Item selecionado para scambo" })).not.toBeInTheDocument();
    });

    it('Deve exibir estado vazio', async () => {
        listarMock.mockResolvedValue([]);
        render(<Produtos />);
        expect(await screen.findByText("Nenhum item disponível")).toBeInTheDocument();
    });

    it('Deve exibir erro e permitir tentar novamente', async () => {
        listarMock.mockRejectedValueOnce(new Error("falha")).mockResolvedValueOnce(produtos);
        render(<Produtos />);
        expect(await screen.findByRole('alert')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: "Tentar novamente" }));
        expect(await screen.findByText("Livro de Tipografia")).toBeInTheDocument();
        expect(listarMock).toHaveBeenCalledTimes(2);
    });
});

describe('Serviço de anúncios', () => {
    it('Deve formatar o tempo desde a publicação', () => {
        const agora = new Date("2026-10-28T12:00:00Z");
        expect(tempoDesde(new Date("2026-10-28T10:00:00Z"), agora)).toBe("há 2h");
        expect(tempoDesde(new Date("2026-10-27T12:00:00Z"), agora)).toBe("há 1d");
        expect(tempoDesde(agora, agora)).toBe("agora");
    });

    it('Deve ignorar datas inválidas', () => {
        expect(paraProduto({ id: 1, titulo: "X", dataPublicacao: "invalida" }).dataPublicacao).toBeUndefined();
    });
});
