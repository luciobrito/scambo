import { perfilMock, usuarioLogadoMock } from "./mocks/usuario.mock";

/*
 * Serviço do usuário logado e do perfil.
 *
 * O back-end de autenticação/perfil ainda não existe: por enquanto as funções
 * retornam os dados de ./mocks/usuario.mock.ts. Quando os endpoints existirem,
 * basta trocar o corpo de cada função pela chamada axios indicada no TODO —
 * as telas não precisam mudar. O formato esperado está em docs/CONTRATO_API.md (na raiz do repositório).
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

export async function obterUsuarioLogado(): Promise<Usuario> {
    // TODO(back-end): GET api/usuarios/me
    // return (await axios.get<Usuario>(import.meta.env.VITE_API_URL + "api/usuarios/me")).data;
    return usuarioLogadoMock;
}

export async function obterPerfil(): Promise<Perfil> {
    // TODO(back-end): GET api/usuarios/me/perfil
    // return (await axios.get<Perfil>(import.meta.env.VITE_API_URL + "api/usuarios/me/perfil")).data;
    return perfilMock;
}

export async function atualizarBio(bio: string): Promise<void> {
    // TODO(back-end): PATCH api/usuarios/me  { bio }
    // await axios.patch(import.meta.env.VITE_API_URL + "api/usuarios/me", { bio });
    usuarioLogadoMock.bio = bio;
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// "2026-08-10T00:00:00Z" -> "ago 2026"
export function mesAno(dataIso: string) {
    const data = new Date(dataIso);
    if (isNaN(data.getTime())) return "";
    return `${MESES[data.getUTCMonth()]} ${data.getUTCFullYear()}`;
}
