import axios from "axios";

export const CATEGORIAS = ["Roupas", "Eletrônicos", "Livros", "Materiais", "Outros"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

// Formato retornado por GET api/anuncio (Models/Anuncio.cs, serializado em camelCase).
export interface AnuncioApi {
    id: number,
    titulo: string,
    descricao?: string,
    estadoConservacao?: string,
    modalidade?: string,
    dataPublicacao?: string,
    status?: string,
    // Campos ainda não expostos pelo backend; usados quando estiverem disponíveis.
    categoria?: string,
    localizacao?: string,
    fotoUrlAnuncio?: string[],
    nomeDoador?: string
}

export interface Produto {
    id: number,
    titulo: string,
    descricao: string,
    categoria: Categoria,
    localizacao?: string,
    imagemUrl?: string,
    doador?: string,
    dataPublicacao?: Date
}

export function normalizarTexto(texto: string) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function paraCategoria(valor?: string): Categoria {
    const encontrada = CATEGORIAS.find(c => valor && normalizarTexto(c) === normalizarTexto(valor));
    return encontrada ?? "Outros";
}

function paraImagemUrl(caminho?: string) {
    if (!caminho) return undefined;
    if (/^https?:\/\//.test(caminho)) return caminho;
    return import.meta.env.VITE_API_URL + "api/imagens/" + encodeURIComponent(caminho);
}

export function paraProduto(anuncio: AnuncioApi): Produto {
    const data = anuncio.dataPublicacao ? new Date(anuncio.dataPublicacao) : undefined;
    return {
        id: anuncio.id,
        titulo: anuncio.titulo,
        descricao: anuncio.descricao ?? "",
        categoria: paraCategoria(anuncio.categoria),
        localizacao: anuncio.localizacao,
        imagemUrl: paraImagemUrl(anuncio.fotoUrlAnuncio?.[0]),
        doador: anuncio.nomeDoador,
        dataPublicacao: data && !isNaN(data.getTime()) ? data : undefined
    };
}

export async function listarAnuncios(signal?: AbortSignal): Promise<Produto[]> {
    const resposta = await axios.get<unknown>(import.meta.env.VITE_API_URL + "api/anuncio", { signal });
    if (!Array.isArray(resposta.data)) {
        throw new Error("A API de anúncios retornou um formato inesperado.");
    }
    return (resposta.data as AnuncioApi[]).map(paraProduto);
}

export function tempoDesde(data: Date, agora = new Date()) {
    const minutos = Math.floor((agora.getTime() - data.getTime()) / 60000);
    if (minutos < 1) return "agora";
    if (minutos < 60) return `há ${minutos}min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `há ${horas}h`;
    return `há ${Math.floor(horas / 24)}d`;
}
