import { useState } from "react";
import { Link } from "react-router";
import useCarregarDados from "../../hooks/useCarregarDados";
import { listarConversas, marcarComoLida, type Conversa, type Mensagem } from "../../services/chat";
import { obterUsuarioLogado } from "../../services/usuario";
import { normalizarTexto } from "../../services/anuncios";
import { variaveisPaleta } from "../../pallete";
import ItemConversa from "./ItemConversa";
import DetalheConversa from "./DetalheConversa";
import { IconeBusca, IconeNovaConversa } from "./IconesConversas";
import styles from "./Conversas.module.css";

/*
 * Tela /app/chat: lista de conversas e conversa aberta.
 *
 * Integração com o back-end (services/chat.ts; mock ligado até VITE_MOCK_CHAT=false)
 * - Lista: GET api/chat/conversas. A ordenação (mais recente primeiro) e a busca são feitas aqui.
 * - Quem sou eu: GET api/usuarios/me, para decidir de que lado cada mensagem aparece.
 * - Ao abrir uma conversa com não lidas: PUT api/chat/mensagens/{id}/visualizadas.
 * - Mensagens, envio e tempo real ficam em DetalheConversa.tsx.
 * - Uma conversa nova nasce do botão "Confirmar Scambo" da tela de Produtos (POST api/chat/conversas).
 */

function maisRecenteAntes(a: Conversa, b: Conversa) {
    return (b.ultimaMensagem?.dataHora ?? "").localeCompare(a.ultimaMensagem?.dataHora ?? "");
}

export default function Conversas() {
    const conversasCarregadas = useCarregarDados(listarConversas);
    const usuario = useCarregarDados(obterUsuarioLogado);
    const [busca, setBusca] = useState("");
    const [selecionadaId, setSelecionadaId] = useState<number | null>(null);
    // No mobile, alterna entre a lista e a conversa aberta.
    const [mostrandoChat, setMostrandoChat] = useState(false);
    const [lidas, setLidas] = useState<Set<number>>(new Set());
    const [ultimas, setUltimas] = useState<Record<number, Mensagem>>({});

    const carregando = conversasCarregadas.estado.status === 'carregando' || usuario.estado.status === 'carregando';
    const erro = conversasCarregadas.estado.status === 'erro' || usuario.estado.status === 'erro';
    const meuId = usuario.estado.status === 'sucesso' ? usuario.estado.dados.id : null;

    const conversas = (conversasCarregadas.estado.status === 'sucesso' ? conversasCarregadas.estado.dados : [])
        .map(c => ({
            ...c,
            naoLidas: lidas.has(c.id) ? 0 : c.naoLidas,
            ultimaMensagem: ultimas[c.id] ?? c.ultimaMensagem
        }))
        .sort(maisRecenteAntes);

    const termo = normalizarTexto(busca);
    const visiveis = conversas.filter(c => !termo
        || normalizarTexto(c.contato.nome).includes(termo)
        || normalizarTexto(c.anuncio.titulo).includes(termo));

    const ativa = conversas.find(c => c.id === selecionadaId) ?? conversas[0];
    const totalNaoLidas = conversas.filter(c => c.naoLidas > 0).length;

    function abrir(conversa: Conversa) {
        setSelecionadaId(conversa.id);
        setMostrandoChat(true);
        if (conversa.naoLidas > 0) {
            // Atualiza a tela na hora; se a API falhar, o contador volta na próxima carga da lista.
            setLidas(atual => new Set(atual).add(conversa.id));
            marcarComoLida(conversa.id).catch(() => { });
        }
    }

    function recarregar() {
        if (conversasCarregadas.estado.status === 'erro') conversasCarregadas.recarregar();
        if (usuario.estado.status === 'erro') usuario.recarregar();
    }

    return (
        <div className={`${styles.pagina} ${mostrandoChat ? styles.mostrandoChat : ""}`} style={variaveisPaleta}>
            <aside className={styles.painelLista}>
                <div className={styles.listaTopo}>
                    <div className={`${styles.marcaMobile} ${styles.somenteMobile}`}>
                        <span className={styles.logo}>Scambo</span>
                        <button type="button" className={styles.botaoIcone} disabled
                            aria-label="Nova conversa (em breve)" title="Inicie uma conversa pelo botão Scambo de um item">
                            <IconeNovaConversa />
                        </button>
                    </div>
                    <div className={styles.tituloLinha}>
                        <h1 className={styles.titulo}>Conversas</h1>
                        {totalNaoLidas > 0 && <span className={`${styles.seloNovas} ${styles.somenteDesktop}`}>{totalNaoLidas} {totalNaoLidas === 1 ? "nova" : "novas"}</span>}
                    </div>
                    <p className={`${styles.subtitulo} ${styles.somenteMobile}`}>
                        {totalNaoLidas} {totalNaoLidas === 1 ? "não lida" : "não lidas"}
                    </p>
                    <div className={styles.busca}>
                        <span className={styles.buscaIcone}><IconeBusca /></span>
                        <input type="search" value={busca} onChange={e => setBusca(e.target.value)}
                            placeholder="Buscar conversa..." aria-label="Buscar conversa" className={styles.buscaInput} />
                    </div>
                </div>

                <div className={styles.lista}>
                    {carregando && [0, 1, 2].map(i => <div key={i} className={styles.esqueleto} />)}
                    {erro && !carregando && (
                        <div className={styles.aviso} role="alert">
                            <p className={styles.avisoTitulo}>Ops, algo deu errado</p>
                            <p className={styles.avisoTexto}>Não foi possível carregar suas conversas.</p>
                            <button type="button" className={styles.botaoPrimario} onClick={recarregar}>Tentar novamente</button>
                        </div>
                    )}
                    {!carregando && !erro && conversas.length === 0 && (
                        <div className={styles.aviso}>
                            <p className={styles.avisoTitulo}>Nenhuma conversa ainda</p>
                            <p className={styles.avisoTexto}>Encontre um item e toque em Scambo para começar.</p>
                            <Link to="/app/products" className={styles.botaoPrimario}>Ver itens</Link>
                        </div>
                    )}
                    {!carregando && conversas.length > 0 && visiveis.length === 0 && (
                        <p className={styles.avisoTexto}>Nenhuma conversa encontrada.</p>
                    )}
                    {!carregando && visiveis.map(c => (
                        <ItemConversa key={c.id} conversa={c} ativa={ativa?.id === c.id} onAbrir={() => abrir(c)} />
                    ))}
                </div>
            </aside>

            <section className={styles.painelChat} aria-label="Conversa aberta">
                {ativa && meuId !== null
                    ? <DetalheConversa key={ativa.id} conversa={ativa} meuId={meuId}
                        onVoltar={() => setMostrandoChat(false)}
                        onEnviada={m => setUltimas(atual => ({ ...atual, [m.conversaId]: m }))} />
                    : <div className={styles.semConversa}>
                        <p className={styles.avisoTexto}>{carregando ? "Carregando..." : "Selecione uma conversa para começar."}</p>
                    </div>}
            </section>
        </div>
    );
}
