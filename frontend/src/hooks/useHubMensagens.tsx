import { useEffect, useState, type ChangeEvent } from "react";
import  * as signalR from '@microsoft/signalr'
import type { Usuario } from "../types/Usuario";
import type { Anuncio } from "../types/Anuncio";
import axios from "axios";

export interface Mensagem {
    conteudo : string,
    remetente : string,
    dataHora : Date
}
export interface Chat {
    id : Number,
    mensagens : Mensagem[],
    anuncio: Anuncio,
    remetente: Usuario,
}
//Caso surja um novo chat, incluir via 
export default function useHubMensangens(){
    const [connection, setConnection] = useState<signalR.HubConnection>();
    const [mensagens, setMensagens] = useState<String[]>([]);
    const [novaMensagem, setNovaMensagem] = useState<String>();
    const [chatsUsuario, setChatsUsuario] = useState<Chat[]>([]);
    
    useEffect(() =>{
        const newConnection = new signalR.HubConnectionBuilder().withUrl(import.meta.env.VITE_API_URL + 'hubmensagens', {accessTokenFactory: ()=>`${localStorage.getItem('token')}`}).withAutomaticReconnect().build();
        setConnection(newConnection)
        buscarChatsUsuario()    
    },[])
    useEffect(()=>{
        if(connection){
            connection.start().then(()=>{
                connection.invoke("GetConnectionId").then(id => console.log("id: ", id))
                connection.on("ReceberMensagem", (mensagem, idChat)=> setMensagens(mensagens => [...mensagens, mensagem]))
                
            })
        }
    },[connection])
    function enviarMensagemTeste(){
        console.log(chatsUsuario)
        console.log(mensagens)
        if(connection) connection.invoke("EnviarMensagem", novaMensagem, 1)
    }
    function handleFormChange(e : ChangeEvent<HTMLInputElement>){
        setNovaMensagem(e.target.value)
    }
    async function buscarChatsUsuario(){
        try{
           var chats = await axios.get("api/chat/mychats")
           setChatsUsuario(chats.data)
        }
        catch(error){
            console.log(error)
        }
        
    }
    return {mensagens, enviarMensagemTeste, handleFormChange}
}