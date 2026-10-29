import { useState } from "react";
import { tempoDesde, type Produto } from "../../services/anuncios";
import { IconeImagem, IconeLocal } from "./IconesProdutos";
import styles from "./Produtos.module.css";

interface ProdutoCardProps {
    produto: Produto,
    escolhido: boolean,
    onAlternar: () => void
}

export default function ProdutoCard({ produto, escolhido, onAlternar }: ProdutoCardProps) {
    const [imagemFalhou, setImagemFalhou] = useState(false);
    const tempo = produto.dataPublicacao ? tempoDesde(produto.dataPublicacao) : undefined;

    return (
        <article className={`${styles.card} ${escolhido ? styles.cardEscolhido : ""}`}>
            <div className={styles.cardMidia}>
                {produto.imagemUrl && !imagemFalhou
                    ? <img src={produto.imagemUrl} alt={produto.titulo} loading="lazy" onError={() => setImagemFalhou(true)} />
                    : <div className={styles.semImagem}><IconeImagem /></div>}
                <div className={styles.cardGradiente} />
                <span className={styles.cardTag}>{produto.categoria}</span>
                {tempo && <span className={styles.cardTempoImagem}>{tempo}</span>}
            </div>

            <div className={styles.cardCorpo}>
                <div>
                    <div className={styles.cardTituloLinha}>
                        <h2 className={styles.cardTitulo}>{produto.titulo}</h2>
                        {tempo && <span className={styles.cardTempo}>{tempo}</span>}
                    </div>
                    {produto.localizacao && (
                        <div className={styles.cardLocal}><IconeLocal /><span>{produto.localizacao}</span></div>
                    )}
                    {produto.descricao && <p className={styles.cardDescricao}>{produto.descricao}</p>}
                </div>

                <div className={styles.cardRodape}>
                    {produto.doador
                        ? <div className={styles.doador}>
                            <div className={styles.avatar} aria-hidden="true">{produto.doador[0].toUpperCase()}</div>
                            <span>{produto.doador}</span>
                        </div>
                        : <span />}
                    <button type="button" onClick={onAlternar} aria-pressed={escolhido}
                        className={`${styles.botaoScambo} ${escolhido ? styles.botaoScamboAtivo : ""}`}>
                        {escolhido ? "✓ Scambo" : "Scambo"}
                    </button>
                </div>
            </div>
        </article>
    );
}
