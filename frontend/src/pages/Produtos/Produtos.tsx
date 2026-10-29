import { useMemo, useState } from "react";
import useProdutos from "../../hooks/useProdutos";
import { CATEGORIAS, normalizarTexto, type Categoria, type Produto } from "../../services/anuncios";
import { pallete, variaveisPaleta } from "../../pallete";
import ProdutoCard from "./ProdutoCard";
import { IconeBusca, IconeSino } from "./IconesProdutos";
import styles from "./Produtos.module.css";

/*
 * Tela /app/products: feed de itens disponíveis para scambo.
 *
 * Integração com o back-end
 * - Dados: GET api/anuncio, via useProdutos -> services/anuncios.ts (API real, sem mock).
 * - Busca e categorias filtram no front a lista já carregada (ver TODO em services/anuncios.ts).
 * - Estados tratados: carregando, erro com "Tentar novamente" e lista vazia.
 * - Pendências do back-end: iniciar o scambo e notificações (TODOs abaixo).
 */

type Filtro = Categoria | "Todos";
const FILTROS: Filtro[] = ["Todos", ...CATEGORIAS];

function filtrarProdutos(produtos: Produto[], filtro: Filtro, busca: string) {
    const termo = normalizarTexto(busca);
    return produtos.filter(p => {
        if (filtro !== "Todos" && p.categoria !== filtro) return false;
        if (!termo) return true;
        return [p.titulo, p.descricao, p.localizacao ?? "", p.categoria, p.doador ?? ""]
            .some(campo => normalizarTexto(campo).includes(termo));
    });
}

function textoQuantidade(total: number) {
    return total === 1 ? "1 item disponível para scambo" : `${total} itens disponíveis para scambo`;
}

export default function Produtos() {
    const { estado, recarregar } = useProdutos();
    const [filtro, setFiltro] = useState<Filtro>("Todos");
    const [busca, setBusca] = useState("");
    const [buscaAberta, setBuscaAberta] = useState(false);
    const [escolhido, setEscolhido] = useState<number | null>(null);

    const produtos = useMemo(() => estado.status === 'sucesso' ? estado.produtos : [], [estado]);
    const visiveis = useMemo(() => filtrarProdutos(produtos, filtro, busca), [produtos, filtro, busca]);
    const produtoEscolhido = produtos.find(p => p.id === escolhido);

    const alternar = (id: number) => setEscolhido(atual => atual === id ? null : id);
    const limparFiltros = () => { setBusca(""); setFiltro("Todos"); };

    const subtitulo = estado.status === 'carregando' ? "Carregando itens..."
        : estado.status === 'erro' ? "Itens indisponíveis no momento"
        : textoQuantidade(produtos.length);

    return (
        <div className={styles.pagina} style={variaveisPaleta}>
            <header className={styles.cabecalho}>
                <div className={styles.tituloDesktop}>
                    <h1 className={styles.titulo}>Tipos de doação</h1>
                    <p className={styles.subtitulo}>{subtitulo}</p>
                </div>
                <div className={styles.marcaMobile}>
                    <span className={styles.logo}>Scambo</span>
                    <p className={styles.subtitulo}>Olá, bem-vindo! 👋</p>
                </div>

                <div className={styles.acoes}>
                    <div className={`${styles.busca} ${buscaAberta || busca ? styles.buscaAberta : ""}`}>
                        <span className={styles.buscaIcone}><IconeBusca cor={pallete.palmLeaf} tamanho={15} /></span>
                        <input type="search" value={busca} onChange={e => setBusca(e.target.value)}
                            placeholder="Buscar itens..." aria-label="Buscar itens" className={styles.buscaInput} />
                    </div>
                    <button type="button" className={`${styles.botaoIcone} ${styles.somenteMobile}`}
                        aria-label={buscaAberta ? "Fechar busca" : "Abrir busca"} aria-expanded={buscaAberta}
                        onClick={() => setBuscaAberta(aberta => !aberta)}>
                        <IconeBusca />
                    </button>
                    {/* TODO(back-end): ainda não há endpoint de notificações; o botão fica desabilitado. */}
                    <button type="button" className={styles.botaoIcone} disabled
                        aria-label="Notificações (em breve)" title="Notificações em breve">
                        <IconeSino />
                    </button>
                </div>
            </header>

            <section className={styles.faixa}>
                <div className={styles.banner}>
                    <div className={styles.bannerCirculo} />
                    <p className={styles.bannerTitulo}>Faça seu scambo hoje! 🌿</p>
                    <p className={styles.bannerTexto}>
                        {estado.status === 'sucesso' && produtos.length > 0
                            ? `${produtos.length} ${produtos.length === 1 ? "item esperando" : "itens esperando"} por você`
                            : "Doe, troque e dê uma nova vida aos objetos"}
                    </p>
                </div>
                <div className={styles.categorias} role="group" aria-label="Filtrar por categoria">
                    {FILTROS.map(f => (
                        <button key={f} type="button" aria-pressed={filtro === f} onClick={() => setFiltro(f)}
                            className={`${styles.categoria} ${filtro === f ? styles.categoriaAtiva : ""}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </section>

            <main className={styles.conteudo} aria-busy={estado.status === 'carregando'}>
                {estado.status === 'carregando' && (
                    <div className={styles.grade} aria-label="Carregando itens">
                        {[0, 1, 2, 3].map(i => <div key={i} className={styles.esqueleto} />)}
                    </div>
                )}

                {estado.status === 'erro' && (
                    <div className={styles.aviso} role="alert">
                        <p className={styles.avisoTitulo}>Ops, algo deu errado</p>
                        <p className={styles.avisoTexto}>{estado.mensagem}</p>
                        <button type="button" className={styles.botaoAviso} onClick={recarregar}>Tentar novamente</button>
                    </div>
                )}

                {estado.status === 'sucesso' && produtos.length === 0 && (
                    <div className={styles.aviso}>
                        <p className={styles.avisoTitulo}>Nenhum item disponível</p>
                        <p className={styles.avisoTexto}>Ainda não há itens publicados para scambo. Volte mais tarde!</p>
                    </div>
                )}

                {estado.status === 'sucesso' && produtos.length > 0 && visiveis.length === 0 && (
                    <div className={styles.aviso}>
                        <p className={styles.avisoTitulo}>Nenhum item encontrado</p>
                        <p className={styles.avisoTexto}>Tente outro termo de busca ou categoria.</p>
                        <button type="button" className={styles.botaoAviso} onClick={limparFiltros}>Limpar filtros</button>
                    </div>
                )}

                {visiveis.length > 0 && (
                    <div className={styles.grade}>
                        {visiveis.map(p => (
                            <ProdutoCard key={p.id} produto={p} escolhido={escolhido === p.id} onAlternar={() => alternar(p.id)} />
                        ))}
                    </div>
                )}
            </main>

            {produtoEscolhido && (
                <div className={styles.confirmacao} role="region" aria-label="Item selecionado para scambo">
                    <div className={styles.confirmacaoTexto}>
                        <p className={styles.confirmacaoRotulo}>Selecionado para scambo</p>
                        <p className={styles.confirmacaoTitulo}>{produtoEscolhido.titulo}</p>
                    </div>
                    <div className={styles.confirmacaoAcoes}>
                        <button type="button" className={styles.botaoCancelar} onClick={() => setEscolhido(null)}>Cancelar</button>
                        {/* TODO(back-end): POST api/chat/conversas { anuncioId } -> 201/200 Conversa
                            (docs/CONTRATO_API.md). Com a resposta, navegar para /app/chat abrindo a
                            conversa retornada. Até o endpoint existir, o botão fica desabilitado. */}
                        <button type="button" className={styles.botaoConfirmar} disabled title="Envio de proposta de scambo em breve">
                            Confirmar Scambo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
