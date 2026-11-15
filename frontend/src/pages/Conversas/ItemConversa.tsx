import type { Chat } from "../../hooks/useHubMensagens";
import { quandoConversa, type Conversa } from "../../services/chat";
import type { Anuncio } from "../../types/Anuncio";
import Avatar from "./Avatar";
import styles from "./Conversas.module.css";

interface ItemConversaProps {
    chat: Chat,
    ativa: boolean,
    onAbrir: () => void
}

export default function ItemConversa({ chat, ativa, onAbrir }: ItemConversaProps) {
    const { anuncio, remetente, mensagens } = chat;
    return (
        <button type="button" onClick={onAbrir} aria-current={ativa ? "true" : undefined}
            className={`${styles.itemConversa} ${ativa ? styles.itemConversaAtivo : ""}`}>
            <Avatar id={contato.id} nome={contato.nome} online={contato.online} />
            <div className={styles.itemTexto}>
                <div className={styles.itemTopo}>
                    <p className={styles.itemNome}>Nome</p>
                    {ultimaMensagem && <p className={styles.itemHora}>{quandoConversa(ultimaMensagem.dataHora)}</p>}
                </div>
                <p className={styles.itemAnuncio}>{anuncio.titulo}</p>
                {ultimaMensagem && (
                    <p className={`${styles.itemUltima} ${naoLidas > 0 ? styles.itemUltimaNaoLida : ""}`}>{ultimaMensagem.conteudo}</p>
                )}
            </div>
            {naoLidas > 0 && (
                <span className={styles.naoLidas} aria-label={`${naoLidas} não lidas`}>{naoLidas}</span>
            )}
        </button>
    );
}
