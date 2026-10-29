import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import useCarregarDados from "../../hooks/useCarregarDados";
import { ErroApi } from "../../services/api";
import { atualizarBio, mesAno, obterPerfil, type Perfil as DadosPerfil } from "../../services/usuario";
import { variaveisPaleta } from "../../pallete";
import { IconeEngrenagem, IconeMais, IconeSair, IconeSeta } from "./IconesPerfil";
import styles from "./Perfil.module.css";

/*
 * Tela /app/profile: dados, histórico e configurações do usuário logado.
 *
 * Integração com o back-end (services/usuario.ts; mock ligado até VITE_MOCK_USUARIO=false)
 * - Dados: GET api/usuarios/me/perfil (cartão, estatísticas, scambo ativo, histórico, conquistas).
 * - "Sobre mim": PATCH api/usuarios/me { bio }. A mensagem de um 400 aparece abaixo do campo.
 * - "Sair": depende da autenticação (TODO abaixo).
 * - Configurações: ainda sem endpoints; os itens ficam desabilitados.
 */

// TODO(back-end): itens sem tela nem endpoint definidos (preferências de notificação,
// privacidade e localização). Ficam desabilitados até existirem.
const CONFIGURACOES = [
    { icone: "🔔", rotulo: "Notificações" },
    { icone: "🔒", rotulo: "Privacidade" },
    { icone: "📍", rotulo: "Localização" },
    { icone: "❓", rotulo: "Ajuda e Suporte" },
];

function CartaoUsuario({ perfil }: { perfil: DadosPerfil }) {
    const { usuario, estatisticas } = perfil;
    const numeros = [
        { rotulo: "Doações", valor: String(estatisticas.doacoes) },
        { rotulo: "Scambos", valor: String(estatisticas.scambos) },
        { rotulo: "Avaliação", valor: `${estatisticas.avaliacao.toFixed(1)} ★` },
    ];
    return (
        <section className={`${styles.cartaoUsuario} ${styles.areaCartao}`}>
            <div className={styles.circuloGrande} />
            <div className={styles.circuloPequeno} />
            <div className={styles.identidade}>
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatar} aria-hidden="true">{usuario.nome[0].toUpperCase()}</div>
                    <span className={styles.avatarSelo}><IconeMais /></span>
                </div>
                <div>
                    <h2 className={styles.nome}>{usuario.nome}</h2>
                    <p className={styles.handle}>@{usuario.nomeUsuario}{usuario.cidade && ` · ${usuario.cidade}`}</p>
                    <p className={styles.membro}><span className={styles.ponto} />Membro desde {mesAno(usuario.membroDesde)}</p>
                </div>
            </div>
            <div className={styles.numeros}>
                {numeros.map(({ rotulo, valor }) => (
                    <div key={rotulo} className={styles.numero}>
                        <p className={styles.numeroValor}>{valor}</p>
                        <p className={styles.numeroRotulo}>{rotulo}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function SobreMim({ bioInicial }: { bioInicial: string }) {
    const [bio, setBio] = useState(bioInicial);
    const [editando, setEditando] = useState(false);
    const [rascunho, setRascunho] = useState(bioInicial);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function salvar() {
        setSalvando(true);
        setErro(null);
        try {
            await atualizarBio(rascunho.trim());
            setBio(rascunho.trim());
            setEditando(false);
        } catch (e) {
            setErro(e instanceof ErroApi ? e.message : "Não foi possível salvar. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <section className={`${styles.secao} ${styles.areaBio}`}>
            <div className={styles.secaoTopo}>
                <h3 className={styles.secaoTitulo}>Sobre mim</h3>
                {!editando && (
                    <button type="button" className={styles.botaoTexto} onClick={() => { setRascunho(bio); setEditando(true); }}>Editar</button>
                )}
            </div>
            {editando
                ? <>
                    <textarea className={styles.bioCampo} value={rascunho} maxLength={300} rows={4}
                        aria-label="Sobre mim" onChange={e => setRascunho(e.target.value)} />
                    {erro && <p className={styles.erroTexto} role="alert">{erro}</p>}
                    <div className={styles.bioAcoes}>
                        <button type="button" className={styles.botaoSecundario} onClick={() => setEditando(false)} disabled={salvando}>Cancelar</button>
                        <button type="button" className={styles.botaoPrimario} onClick={salvar} disabled={salvando}>
                            {salvando ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </>
                : <p className={styles.bio}>{bio || "Conte um pouco sobre você."}</p>}
        </section>
    );
}

export default function Perfil() {
    const navigate = useNavigate();
    const { estado, recarregar } = useCarregarDados(obterPerfil);
    const configuracoesRef = useRef<HTMLElement>(null);

    // TODO(back-end): com a autenticação definida, encerrar a sessão antes de navegar
    // (ex.: POST api/auth/logout ou descartar o token) e limpar dados do usuário em memória.
    const sair = () => navigate("/login");

    return (
        <div className={styles.pagina} style={variaveisPaleta}>
            <header className={styles.cabecalho}>
                <div className={styles.tituloDesktop}>
                    <h1 className={styles.titulo}>Meu Perfil</h1>
                    <p className={styles.subtitulo}>Gerencie suas informações e histórico</p>
                </div>
                <span className={styles.logoMobile}>Scambo</span>
                <button type="button" className={`${styles.botaoSair} ${styles.somenteDesktop}`} onClick={sair}>
                    <IconeSair />Sair
                </button>
                <button type="button" className={`${styles.botaoIcone} ${styles.somenteMobile}`} aria-label="Ir para configurações"
                    onClick={() => configuracoesRef.current?.scrollIntoView({ behavior: "smooth" })}>
                    <IconeEngrenagem />
                </button>
            </header>

            <main className={styles.conteudo} aria-busy={estado.status === 'carregando'}>
                {estado.status === 'carregando' && (
                    <div className={styles.grade} aria-label="Carregando perfil">
                        <div className={styles.esqueleto} /><div className={styles.esqueleto} />
                    </div>
                )}

                {estado.status === 'erro' && (
                    <div className={styles.aviso} role="alert">
                        <p className={styles.secaoTitulo}>Ops, algo deu errado</p>
                        <p className={styles.avisoTexto}>Não foi possível carregar seu perfil.</p>
                        <button type="button" className={styles.botaoPrimario} onClick={recarregar}>Tentar novamente</button>
                    </div>
                )}

                {estado.status === 'sucesso' && (
                    <div className={styles.grade}>
                        <div className={styles.coluna}>
                            <CartaoUsuario perfil={estado.dados} />
                            <SobreMim bioInicial={estado.dados.usuario.bio ?? ""} />

                            <section ref={configuracoesRef} className={`${styles.secao} ${styles.areaConfig}`}>
                                <h3 className={styles.secaoTitulo}>Configurações</h3>
                                <div className={styles.lista}>
                                    {CONFIGURACOES.map(({ icone, rotulo }) => (
                                        <button key={rotulo} type="button" className={styles.itemConfig} disabled title={`${rotulo} em breve`}>
                                            <span className={styles.itemConfigIcone} aria-hidden="true">{icone}</span>
                                            <span className={styles.itemConfigRotulo}>{rotulo}</span>
                                            <IconeSeta />
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className={styles.coluna}>
                            {estado.dados.scamboAtivo && (
                                <section className={`${styles.secao} ${styles.scamboAtivo} ${styles.areaAtivo}`}>
                                    <div className={styles.secaoTopo}>
                                        <h3 className={styles.secaoTitulo}>Scambo Ativo</h3>
                                        <span className={styles.seloAndamento}>{estado.dados.scamboAtivo.status}</span>
                                    </div>
                                    <div className={styles.linhaItem}>
                                        {estado.dados.scamboAtivo.imagemUrl && <img src={estado.dados.scamboAtivo.imagemUrl} alt="" className={styles.imagemAtivo} />}
                                        <div>
                                            <p className={styles.itemTitulo}>{estado.dados.scamboAtivo.titulo}</p>
                                            <p className={styles.itemDetalhe}>
                                                com {estado.dados.scamboAtivo.com}{estado.dados.scamboAtivo.localizacao && ` · ${estado.dados.scamboAtivo.localizacao}`}
                                            </p>
                                            <p className={styles.itemAviso}>Aguardando confirmação da troca</p>
                                        </div>
                                    </div>
                                </section>
                            )}

                            <section className={`${styles.secao} ${styles.areaHistorico}`}>
                                <h3 className={styles.secaoTitulo}>Histórico de Scambos</h3>
                                {estado.dados.historico.length === 0
                                    ? <p className={styles.avisoTexto}>Você ainda não concluiu nenhum scambo.</p>
                                    : <div className={styles.lista}>
                                        {estado.dados.historico.map(item => (
                                            <div key={item.id} className={`${styles.itemLista} ${styles.linhaItem}`}>
                                                {item.imagemUrl
                                                    ? <img src={item.imagemUrl} alt={item.titulo} className={styles.imagemHistorico} />
                                                    : <div className={styles.imagemHistorico} />}
                                                <div className={styles.itemTexto}>
                                                    <p className={styles.itemTitulo}>{item.titulo}</p>
                                                    <p className={styles.itemDetalhe}>com {item.com} · {mesAno(item.data)}</p>
                                                </div>
                                                <span className={styles.seloStatus}>{item.status}</span>
                                            </div>
                                        ))}
                                    </div>}
                            </section>

                            <section className={`${styles.secao} ${styles.areaConquistas}`}>
                                <h3 className={styles.secaoTitulo}>Conquistas</h3>
                                <div className={styles.conquistas}>
                                    {estado.dados.conquistas.map(c => (
                                        <div key={c.id} className={`${styles.conquista} ${c.conquistada ? styles.conquistada : ""}`}
                                            title={c.conquistada ? "Conquistada" : "Ainda não conquistada"}>
                                            <span className={styles.conquistaEmoji} aria-hidden="true">{c.emoji}</span>
                                            <p className={styles.conquistaNome}>{c.nome}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <button type="button" className={`${styles.botaoSair} ${styles.botaoSairMobile} ${styles.somenteMobile}`} onClick={sair}>
                            Sair da conta
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
