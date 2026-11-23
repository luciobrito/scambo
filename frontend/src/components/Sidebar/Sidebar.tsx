import type { ReactElement } from "react";
import { NavLink, useNavigate } from "react-router";
import useCarregarDados from "../../hooks/useCarregarDados";
import { obterUsuarioLogado } from "../../services/usuario";
import { IconeChat, IconeInicio, IconePerfil, IconeSair } from "./IconesSidebar";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../hooks/useAuth";
import { useUserData } from "../../hooks/useUserData";

/*
 * Navegação das telas /app (fixa à esquerda no desktop, barra inferior no mobile).
 *
 * Integração com o back-end
 * - Rodapé: GET api/usuarios/me (services/usuario.ts; mock até VITE_MOCK_USUARIO=false).
 * - Ícone de sair: depende da autenticação (TODO abaixo).
 */

interface ItemMenu {
    rotulo: string,
    icone: ReactElement,
    // Sem destino enquanto a rota não existir no roteador.
    destino?: string
}

const ITENS_MENU: ItemMenu[] = [
    { rotulo: "Início", icone: <IconeInicio />, destino: "/app/products" },
    { rotulo: "Chat", icone: <IconeChat />, destino: "/app/chat" },
    { rotulo: "Perfil", icone: <IconePerfil />, destino: "/app/profile" },
];

export default function Sidebar() {
    const { estado } = useCarregarDados(obterUsuarioLogado);
    //const usuario = estado.status === 'sucesso' ? estado.dados : null;
    const navigate = useNavigate();
    const {logout} = useAuth()
    const {relatorioUsuario} = useUserData()
    // TODO(back-end): com a autenticação definida, encerrar a sessão antes de navegar
    // (mesma regra do botão Sair da tela de Perfil).
    const sair = () => navigate("/login");
    
    return (
        <aside className={styles.sidebar}>
            <div className={styles.cabecalho}>
                <span className={styles.logo}>Scambo</span>
                <p className={styles.subtitulo}>Comunidade de doações</p>
            </div>

            <nav className={styles.menu} aria-label="Navegação principal">
                {ITENS_MENU.map(item => item.destino
                    ? <NavLink key={item.rotulo} to={item.destino}
                        className={({ isActive }) => `${styles.item} ${isActive ? styles.itemAtivo : ""}`}>
                        {item.icone}<span>{item.rotulo}</span>
                    </NavLink>
                    : <span key={item.rotulo} className={`${styles.item} ${styles.itemDesabilitado}`}
                        aria-disabled="true" title={`${item.rotulo} em breve`}>
                        {item.icone}<span>{item.rotulo}</span>
                    </span>
                )}
            </nav>

            <div className={styles.usuario}>
                <NavLink to="/app/profile" className={styles.usuarioPerfil} aria-label="Abrir meu perfil">
                    <div className={styles.avatar} aria-hidden="true">{relatorioUsuario?.nome[0].toUpperCase()}</div>
                    <div className={styles.usuarioTexto}>
                        <p className={styles.usuarioNome}>{relatorioUsuario ? relatorioUsuario.nome : "Carregando..."}</p>
                        {relatorioUsuario && <p className={styles.usuarioId}>{relatorioUsuario.email}</p>}
                    </div>
                </NavLink>
                <button type="button" className={styles.botaoSair} onClick={logout} aria-label="Sair da conta" title="Sair">
                    <IconeSair />
                </button>
            </div>
        </aside>
    );
}
