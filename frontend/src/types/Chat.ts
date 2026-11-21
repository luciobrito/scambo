import { jwtDecode, type JwtPayload } from "jwt-decode";
import type { Chat, IMensagem } from "../hooks/useHubMensagens";
import type { Anuncio } from "./Anuncio";
import type { Usuario } from "./Usuario";

export class ChatClass implements Chat{
    id: number;
    mensagens: IMensagem[];
    anuncio: Anuncio;
    remetente: Usuario;
    ultimaMensagem: IMensagem; 
    naoLidas: number; 
    constructor(chat : Chat){
        this.id = chat.id
        this.mensagens = chat.mensagens
        this.anuncio = chat.anuncio
        this.remetente = chat.remetente
        this.ultimaMensagem = chat.ultimaMensagem
        this.naoLidas = chat.naoLidas
    }
    getUsuarioDestino() : Usuario {
        if(this.getIdUsuarioLogado() == this.remetente.id) return this.anuncio.anunciante
        else return this.remetente
    }
    private getIdUsuarioLogado() : number{
        var token = localStorage.getItem("token")
        const decoded = jwtDecode<JwtPayload>(token!)
        return Number.parseFloat(decoded.sub!)
    }
}