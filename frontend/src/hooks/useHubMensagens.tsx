import { useEffect, useState, type ChangeEvent, type SubmitEvent, type SubmitEventHandler } from "react";
import  * as signalR from '@microsoft/signalr'
import type { Usuario } from "../types/Usuario";
import type { Anuncio } from "../types/Anuncio";
import axios from "axios";

export interface IMensagem {
    id : number,
    conteudo : string,
    remetente : Usuario,
    dataHora : Date,
    visualizada : boolean,

}
export interface Chat {
    id : number,
    mensagens : IMensagem[],
    anuncio: Anuncio,
    remetente: Usuario,
    ultimaMensagem: IMensagem
}
//Caso surja um novo chat, incluir via 
export default function useHubMensangens(){
    const [connection, setConnection] = useState<signalR.HubConnection>();
    const [mensagens, setMensagens] = useState<IMensagem[]>([]);
    const [novaMensagem, setNovaMensagem] = useState<string>();
    const [chatsUsuario, setChatsUsuario] = useState<Chat[]>([]);
    
    useEffect(() =>{
        const newConnection = new signalR.HubConnectionBuilder().withUrl(import.meta.env.VITE_API_URL + 'hubmensagens', {accessTokenFactory: ()=>`${localStorage.getItem('token')}`}).withAutomaticReconnect().build();
        setConnection(newConnection)
        buscarChatsUsuario()
        buscarMensagensPorChat(1)  
        
    },[])
    useEffect(()=>{
        if(connection){
            connection.start().then(()=>{
                connection.invoke("GetConnectionId").then(id => console.log("id: ", id))
                connection.on("ReceberMensagem", (mensagem)=> 
                    {
                        setMensagens(mensagens => [...mensagens, JSON.parse(mensagem)])
                        console.log(
                        JSON.parse(mensagem))
                    })
                
            })
        }
    },[connection])
    function enviarMensagemTeste( e : SubmitEvent<HTMLFormElement>){
        e.preventDefault()
        setNovaMensagem("")
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
           console.log(chats.data)
           setChatsUsuario(chats.data)
        }
        catch(error){
            console.log(error)
        }
        
    }
    async function buscarMensagensPorChat(idChat: number){
        try{
            var response = await axios.get("api/chat/mensagens/"+idChat)
            setMensagens(response.data)
        }
        catch{}
    }
    return {mensagens, novaMensagem,buscarMensagensPorChat,enviarMensagemTeste, handleFormChange, chatsUsuario}
}