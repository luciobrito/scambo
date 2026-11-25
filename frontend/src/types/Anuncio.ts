import type { Usuario } from "./Usuario";

export interface Anuncio {
    id : number,
    titulo : string,
    descricao : string,
    estadoConservacao: string,
    modalidade : string,
    dataPublicacao : Date,
    status : string,
    anunciante : Usuario,
}

export class AnuncioClass {
    status : string
    id : number
    titulo : string
    descricao : string
    estadoConservacao: string
    modalidade : string
    dataPublicacao : Date
    anunciante : Usuario
    constructor(anuncio: Anuncio){
        this.status = anuncio.status;
        this.id = anuncio.id
        this.titulo = anuncio.titulo
        this.descricao = anuncio.descricao
        this.estadoConservacao = anuncio.estadoConservacao
        this.modalidade = anuncio.modalidade
        this.dataPublicacao = anuncio.dataPublicacao
        this.anunciante = anuncio.anunciante
    }
    
}