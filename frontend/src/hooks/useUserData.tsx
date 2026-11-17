import { useEffect, useState } from "react";
import type { Usuario } from "../types/Usuario";
import axios from "axios";


export function useUserData(){
    const [usuario, setUsuario] = useState<Usuario>()
    useEffect(()=>{buscarUsuarioLogado()},[])

    async function buscarUsuarioLogado(){
        try{
            var response = await axios.get("api/usuarios")
            setUsuario(response.data)
        }
        catch{}
    }
    return {usuario}

}