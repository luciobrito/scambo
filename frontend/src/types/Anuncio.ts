import type { Usuario } from "./Usuario";

export interface Anuncio {
    titulo : string,
    descricao : string,
    estadoConservacao: string,
    modalidade : string,
    dataPublicacao : Date,
    status : string,
    anunciante : Usuario,
}