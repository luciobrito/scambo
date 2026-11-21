import type { Chat } from "../../hooks/useHubMensagens";
import { quandoConversa, type Conversa } from "../../services/chat";
import type { Anuncio } from "../../types/Anuncio";
import { ChatClass } from "../../types/Chat";
import Avatar from "./Avatar";
import styles from "./Conversas.module.css";

interface ItemConversaProps {
    chat: Chat,
    ativa: boolean,
    onAbrir: () => void
}

export default function ItemConversa({ chat, ativa, onAbrir }: ItemConversaProps) {
    const { anuncio, remetente, mensagens, naoLidas } = chat;
    const chatClass = new ChatClass(chat)
    return (
        <button type="button" onClick={onAbrir} aria-current={ativa ? "true" : undefined}
            className={`${styles.itemConversa} ${ativa ? styles.itemConversaAtivo : ""}`}>
            <Avatar id={anuncio.anunciante.id} nome={anuncio.anunciante.nome} online={false} />
            <div className={styles.itemTexto}>
                <div className={styles.itemTopo}>
                    <p className={styles.itemNome}>{chatClass.getUsuarioDestino().nome}</p>
                    {chat.ultimaMensagem && <p className={styles.itemHora}>{quandoConversa(chat.ultimaMensagem.dataHora.toString())}</p>}
                </div>
                <p className={styles.itemAnuncio}>{anuncio.titulo}</p>
                {chat.ultimaMensagem && (
                    <p className={`${styles.itemUltima} ${naoLidas > 0 ? styles.itemUltimaNaoLida : ""}`}>{chat.ultimaMensagem.conteudo}</p>
                )}
            </div>
            {naoLidas > 0 && (
                <span className={styles.naoLidas} aria-label={`${naoLidas} não lidas`}>{naoLidas}</span>
            )}
        </button>
    );
}
