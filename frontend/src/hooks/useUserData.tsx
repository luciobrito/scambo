import { useEffect, useState, type ChangeEvent } from "react";
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
    const [fotoPerfil, setFotoPerfil] = useState<File | null>();
    useEffect(()=>{buscarUsuarioLogado()},[])
    const handleFileChange = (e : ChangeEvent<HTMLInputElement>) => {
        setFotoPerfil(e.target.files![0])
    }
    async function buscarUsuarioLogado(){
        try{
            var response = await axios.get("api/usuarios")
            setRelatorioUsuario(response.data)
        }
        catch{}
    }
    return {relatorioUsuario, handleFileChange, fotoPerfil}

}