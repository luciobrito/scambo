import { api, usarMock } from "./api";
import { perfilMock, usuarioLogadoMock } from "./mocks/usuario.mock";

/*
 * Serviço do usuário logado e do perfil (Sidebar e tela /app/profile).
 *
 * Situação: os endpoints ainda não existem no back-end, então o padrão é usar os dados de
 * ./mocks/usuario.mock.ts. As chamadas reais já estão implementadas abaixo; para usá-las,
 * defina VITE_MOCK_USUARIO=false no frontend/.env. As telas não precisam mudar.
 *
 * Todos os endpoints usam "me": o back-end identifica o usuário pela sessão/token
 * (depende da autenticação, docs/GUIA_BACKEND.md, etapa 2).
 * Formatos em docs/CONTRATO_API.md; os tipos abaixo são a referência do contrato.
 */

export interface Usuario {
    id: number,
    nome: string,
    // Identificador público exibido como "@nomeUsuario".
    nomeUsuario: string,
    cidade?: string,
    // Data ISO 8601 (ex.: "2025-01-15T00:00:00Z").
    membroDesde: string,
    fotoPerfilUrl?: string,
    bio?: string
}

export interface EstatisticasUsuario {
    doacoes: number,
    scambos: number,
    // Média de 0 a 5.
    avaliacao: number
}

export type StatusScambo = "Em andamento" | "Concluído" | "Cancelado";

export interface ScamboResumo {
    id: number,
    titulo: string,
    // Nome da outra pessoa envolvida no scambo.
    com: string,
    localizacao?: string,
    // Data ISO 8601.
    data: string,
    status: StatusScambo,
    imagemUrl?: string
}

export interface Conquista {
    id: number,
    nome: string,
    emoji: string,
    conquistada: boolean
}

export interface Perfil {
    usuario: Usuario,
    estatisticas: EstatisticasUsuario,
    scamboAtivo: ScamboResumo | null,
    historico: ScamboResumo[],
    conquistas: Conquista[]
}

// TODO(back-end): GET api/usuarios/me -> 200 Usuario | 401 sem sessão. Nunca incluir senha/e-mail.
export async function obterUsuarioLogado(): Promise<Usuario> {
    if (usarMock.usuario) return usuarioLogadoMock;
    const { data } = await api.get<Usuario>("api/usuarios/me");
    return data;
}

// TODO(back-end): GET api/usuarios/me/perfil -> 200 Perfil | 401.
// Estatísticas, histórico e conquistas vêm prontos; o front só exibe.
export async function obterPerfil(): Promise<Perfil> {
    if (usarMock.usuario) return perfilMock;
    const { data } = await api.get<Perfil>("api/usuarios/me/perfil");
    return data;
}

// TODO(back-end): PATCH api/usuarios/me { bio } -> 204 | 400 { mensagem } (ex.: mais de 300 caracteres).
// A mensagem do 400 é exibida abaixo do campo na tela de Perfil.
export async function atualizarBio(bio: string): Promise<void> {
    if (usarMock.usuario) {
        usuarioLogadoMock.bio = bio;
        return;
    }
    await api.patch("api/usuarios/me", { bio });
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// "2026-08-10T00:00:00Z" -> "ago 2026"
export function mesAno(dataIso: string) {
    const data = new Date(dataIso);
    if (isNaN(data.getTime())) return "";
    return `${MESES[data.getUTCMonth()]} ${data.getUTCFullYear()}`;
}
