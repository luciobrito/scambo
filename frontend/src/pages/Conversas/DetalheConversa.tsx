import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import useCarregarDados from "../../hooks/useCarregarDados";
import { assinarMensagens, enviarMensagem, horaCurta, listarMensagens, type Conversa, type Mensagem } from "../../services/chat";
import Avatar from "./Avatar";
import { IconeEnviar, IconeImagem, IconeOpcoesHorizontal, IconeVoltar } from "./IconesConversas";
import styles from "./Conversas.module.css";

interface DetalheConversaProps {
    conversa: Conversa,
    meuId: number,
    onVoltar: () => void,
    onEnviada: (mensagem: Mensagem) => void
}

const BANNER_SCAMBO = {
    "Em andamento": { rotulo: "Scambo em andamento", selo: "Ativo" },
    "Concluído": { rotulo: "Scambo concluído", selo: "Concluído" },
    "Cancelado": { rotulo: "Scambo cancelado", selo: "Cancelado" },
};

function juntarMensagens(carregadas: Mensagem[], novas: Mensagem[]) {
    const porId = new Map<number, Mensagem>();
    [...carregadas, ...novas].forEach(m => porId.set(m.id, m));
    return [...porId.values()].sort((a, b) => a.dataHora.localeCompare(b.dataHora));
}

export default function DetalheConversa({ conversa, meuId, onVoltar, onEnviada }: DetalheConversaProps) {
    const carregar = useCallback(() => listarMensagens(conversa.id), [conversa.id]);
    const { estado, recarregar } = useCarregarDados(carregar);
    const [novas, setNovas] = useState<Mensagem[]>([]);
    const [texto, setTexto] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erroEnvio, setErroEnvio] = useState(false);
    const listaRef = useRef<HTMLDivElement>(null);

    const mensagens = estado.status === 'sucesso' ? juntarMensagens(estado.dados, novas) : [];
    const banner = conversa.statusScambo ? BANNER_SCAMBO[conversa.statusScambo] : null;

    useEffect(() => assinarMensagens(conversa.id, m => setNovas(lista => [...lista, m])), [conversa.id]);

    // Mantém a conversa rolada até a mensagem mais recente.
    useEffect(() => {
        if (listaRef.current) listaRef.current.scrollTop = listaRef.current.scrollHeight;
    }, [mensagens.length]);

    async function enviar(e: FormEvent) {
        e.preventDefault();
        const conteudo = texto.trim();
        if (!conteudo || enviando) return;
        setEnviando(true);
        setErroEnvio(false);
        try {
            const mensagem = await enviarMensagem(conversa.id, meuId, conteudo);
            setNovas(lista => [...lista, mensagem]);
            setTexto("");
            onEnviada(mensagem);
        } catch {
            setErroEnvio(true);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className={styles.detalhe}>
            <div className={styles.detalheTopo}>
                <button type="button" className={`${styles.botaoIcone} ${styles.somenteMobile}`} onClick={onVoltar} aria-label="Voltar para conversas">
                    <IconeVoltar />
                </button>
                <Avatar id={conversa.contato.id} nome={conversa.contato.nome} online={conversa.contato.online} pequeno />
                <div className={styles.detalheContato}>
                    <h2 className={styles.detalheNome}>{conversa.contato.nome}</h2>
                    <p className={`${styles.detalheStatus} ${conversa.contato.online ? styles.detalheOnline : ""}`}>
                        {conversa.contato.online ? "online" : "visto há pouco"} · {conversa.anuncio.titulo}
                    </p>
                </div>
                <button type="button" className={styles.botaoIcone} disabled aria-label="Mais opções (em breve)" title="Mais opções em breve">
                    <IconeOpcoesHorizontal />
                </button>
            </div>

            <div className={styles.bannerScambo}>
                <div className={styles.bannerImagem}>
                    {conversa.anuncio.imagemUrl && <img src={conversa.anuncio.imagemUrl} alt="" />}
                </div>
                <div className={styles.bannerTexto}>
                    <p className={styles.bannerRotulo}>{banner ? banner.rotulo : "Conversa sobre"}</p>
                    <p className={styles.bannerTitulo}>{conversa.anuncio.titulo}</p>
                </div>
                {banner && <span className={styles.bannerSelo}>{banner.selo}</span>}
            </div>

            <div className={styles.mensagens} ref={listaRef} aria-live="polite">
                {estado.status === 'carregando' && <p className={styles.avisoMensagens}>Carregando mensagens...</p>}
                {estado.status === 'erro' && (
                    <div className={styles.avisoMensagens} role="alert">
                        <p>Não foi possível carregar as mensagens.</p>
                        <button type="button" className={styles.botaoTexto} onClick={recarregar}>Tentar novamente</button>
                    </div>
                )}
                {estado.status === 'sucesso' && mensagens.length === 0 && (
                    <p className={styles.avisoMensagens}>Nenhuma mensagem ainda. Diga olá! 👋</p>
                )}
                {mensagens.map(m => {
                    const minha = m.remetenteId === meuId;
                    return (
                        <div key={m.id} className={`${styles.linhaMensagem} ${minha ? styles.linhaMinha : ""}`}>
                            <div className={`${styles.balao} ${minha ? styles.balaoMeu : styles.balaoOutro}`}>
                                <p className={styles.balaoTexto}>{m.conteudo}</p>
                                <p className={styles.balaoHora}>{horaCurta(m.dataHora)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {erroEnvio && <p className={styles.erroEnvio} role="alert">Não foi possível enviar a mensagem. Tente novamente.</p>}
            <form className={styles.compositor} onSubmit={enviar}>
                <button type="button" className={styles.botaoIcone} disabled aria-label="Enviar imagem (em breve)" title="Envio de imagem em breve">
                    <IconeImagem />
                </button>
                <input value={texto} onChange={e => setTexto(e.target.value)} placeholder="Mensagem..."
                    aria-label="Mensagem" className={styles.campoMensagem} maxLength={1000} />
                <button type="submit" aria-label="Enviar mensagem" disabled={!texto.trim() || enviando}
                    className={`${styles.botaoEnviar} ${texto.trim() ? styles.botaoEnviarAtivo : ""}`}>
                    <IconeEnviar />
                </button>
            </form>
        </div>
    );
}
