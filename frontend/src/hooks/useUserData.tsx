import { useEffect, useState } from "react";
import type { Usuario } from "../types/Usuario";
import axios from "axios";
import type { Anuncio } from "../types/Anuncio";

export interface RelatorioUsuario {
    id : number,
    nome : string,
    email : string,
    tipoUsuario : string,
    criadoEm : Date,
    atualizadoEm : Date,
    anunciosFinalizados : Anuncio[],
    anunciosAtivos: Anuncio[],
    quantidadeAnuncios : number
}

export function useUserData(){
    const [relatorioUsuario, setRelatorioUsuario] = useState<RelatorioUsuario>()
    useEffect(()=>{buscarUsuarioLogado()},[])

    async function buscarUsuarioLogado(){
        try{
            var response = await axios.get("api/usuarios")
            setRelatorioUsuario(response.data)
        }
        catch{}
    }
    return {relatorioUsuario}

}