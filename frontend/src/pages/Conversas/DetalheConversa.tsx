import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent, type SubmitEvent } from "react";
import useCarregarDados from "../../hooks/useCarregarDados";
import { assinarMensagens, enviarMensagem, horaCurta, listarMensagens, type Conversa, type Mensagem } from "../../services/chat";
import Avatar from "./Avatar";
import { IconeEnviar, IconeImagem, IconeOpcoesHorizontal, IconeVoltar } from "./IconesConversas";
import styles from "./Conversas.module.css";
import useHubMensangens, { type Chat, type IMensagem } from "../../hooks/useHubMensagens";
import { getAuthUserId } from "../../utils/isAuth";
import { ChatClass } from "../../types/Chat";

/*
 * Conversa aberta: mensagens, envio e recebimento em tempo real.
 *
 * Integração com o back-end (services/chat.ts)
 * - Histórico: GET api/chat/mensagens/{idConversa}.
 * - Envio: POST api/chat/enviar. A mensagem só aparece depois da resposta 201, com o id do servidor.
 * - Tempo real: assinarMensagens (SignalR). Mensagens repetidas são descartadas pelo id, então
 *   o mesmo id precisa vir no REST e no evento do hub.
 */

interface DetalheConversaProps {
    chat : Chat,
    mensagensConversa : IMensagem[],
    meuId: number,
    onVoltar: () => void,
    onEnviada: (mensagem: Mensagem) => void,
    enviarMensagem : (e : SubmitEvent<HTMLFormElement>) => void,
    handleFormChange : (e : ChangeEvent<HTMLInputElement>) => void,
    novaMensagem : string 
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

export default function DetalheConversa({ chat, mensagensConversa, meuId, onVoltar, onEnviada, enviarMensagem, handleFormChange, novaMensagem }: DetalheConversaProps) {
    
    //const hubMensagens = useHubMensangens();
    
    const carregar = useCallback(() => listarMensagens(chat.id), [chat.id]);
    const { estado, recarregar } = useCarregarDados(carregar);
    const [novas, setNovas] = useState<Mensagem[]>([]);
    const [texto, setTexto] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erroEnvio, setErroEnvio] = useState(false);
    const listaRef = useRef<HTMLDivElement>(null);
    //const hub = useHubMensangens();
    const mensagens = estado.status === 'sucesso' ? juntarMensagens(estado.dados, novas) : [];
    const banner =  BANNER_SCAMBO["Em andamento"];

    useEffect(() => assinarMensagens(chat.id, m => setNovas(lista => [...lista, m])), [chat.id]);
    var chatClass = new ChatClass(chat);
    // Mantém a conversa rolada até a mensagem mais recente.
    useEffect(() => {
        if (listaRef.current) listaRef.current.scrollTop = listaRef.current.scrollHeight;
    }, [mensagensConversa]);

    return (
        <div className={styles.detalhe}>
            <div className={styles.detalheTopo}>
                <button type="button" className={`${styles.botaoIcone} ${styles.somenteMobile}`} onClick={onVoltar} aria-label="Voltar para conversas">
                    <IconeVoltar />
                </button>
                <Avatar id={chatClass.getUsuarioDestino().id} nome={chatClass.getUsuarioDestino().nome} online={true} pequeno />
                <div className={styles.detalheContato}>
                    <h2 className={styles.detalheNome}>teste</h2>
                    <p className={`${styles.detalheStatus}`}>
                        online · {chat.anuncio.titulo}
                    </p>
                </div>
                {/* TODO(back-end): ações da conversa (ex.: concluir ou cancelar o scambo) ainda sem endpoint. */}
                <button type="button" className={styles.botaoIcone} disabled aria-label="Mais opções (em breve)" title="Mais opções em breve">
                    <IconeOpcoesHorizontal />
                </button>
            </div>

            <div className={styles.bannerScambo}>
                <div className={styles.bannerImagem}>
                    {/*chat.anuncio.imagemUrl && <img src={conversa.anuncio.imagemUrl} alt="" />*/}
                </div>
                <div className={styles.bannerTexto}>
                    <p className={styles.bannerRotulo}>{banner ? banner.rotulo : "Conversa sobre"}</p>
                    <p className={styles.bannerTitulo}>{chat.anuncio.titulo}</p>
                </div>
                {banner && <span className={styles.bannerSelo}>{banner.selo}</span>}
            </div>

            <div className={styles.mensagens} id="mensagens-section" ref={listaRef} aria-live="polite">
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
                {mensagensConversa.map(m => {
                    const minha = getAuthUserId() == m.remetente.id;
                    return (
                        <div key={m.id} className={`${styles.linhaMensagem} ${minha ? styles.linhaMinha : ""}`}>
                            <div className={`${styles.balao} ${minha ? styles.balaoMeu : styles.balaoOutro}`}>
                                <p className={styles.balaoTexto}>{m.conteudo} </p>
                                <p className={styles.balaoHora}>{horaCurta(m.dataHora.toString())}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {erroEnvio && <p className={styles.erroEnvio} role="alert">Não foi possível enviar a mensagem. Tente novamente.</p>}
            <form className={styles.compositor} onSubmit={(e) => {enviarMensagem(e)}}>
                {/* TODO(back-end): o upload já existe (POST api/imagens, ImagensController), mas falta
                    associar a imagem à mensagem (ex.: campo imagemUrl em Mensagem). */}
                <button type="button" className={styles.botaoIcone} disabled aria-label="Enviar imagem (em breve)" title="Envio de imagem em breve">
                    <IconeImagem />
                </button>
                <input value={novaMensagem} onChange={e => {setTexto(e.target.value); handleFormChange(e)}} placeholder="Mensagem..."
                    aria-label="Mensagem" className={styles.campoMensagem} maxLength={1000} />
                <button type="submit" aria-label="Enviar mensagem" disabled={!texto.trim() || enviando}
                    className={`${styles.botaoEnviar} ${texto.trim() ? styles.botaoEnviarAtivo : ""}`}>
                    <IconeEnviar />
                </button>
            </form>
        </div>
    );
}
