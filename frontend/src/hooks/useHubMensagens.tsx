import { useEffect, useRef, useState, type ChangeEvent, type SubmitEvent } from "react";
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
    chatId : number
}
export interface Chat {
    id : number,
    mensagens : IMensagem[],
    anuncio: Anuncio,
    remetente: Usuario,
    ultimaMensagem: IMensagem,
    naoLidas: number
}
//Caso surja um novo chat, incluir via 
export default function useHubMensangens(){
    const [connection, setConnection] = useState<signalR.HubConnection>();
    const [mensagens, setMensagens] = useState<IMensagem[]>([]);
    const [novaMensagem, setNovaMensagem] = useState<string>("");
    const [chatsUsuario, setChatsUsuario] = useState<Chat[]>([]);
    const [idChatAtivo, setIdChatAtivo] = useState<number>();
    const idChatAtivoRef = useRef<number>(idChatAtivo);
    useEffect(() =>{
        const newConnection = new signalR.HubConnectionBuilder().withUrl(import.meta.env.VITE_API_URL + 'hubmensagens', {accessTokenFactory: ()=>`${localStorage.getItem('token')}`}).withAutomaticReconnect().build();
        setConnection(newConnection)
        buscarChatsUsuario()
        
    },[])
    useEffect(()=>{buscarMensagensPorChat(idChatAtivo); idChatAtivoRef.current = idChatAtivo},[idChatAtivo])
    useEffect(()=>{
        if(connection){
            connection.start().then(()=>{
                connection.invoke("GetConnectionId").then(id => console.log("id: ", id))
                connection.on("ReceberMensagem", (mensagem)=> 
                    {
                        
                        var mensagemJson = JSON.parse(mensagem)
                        //setMensagens(mensagens => [...mensagens, mensagemJson])
                        adicionarMensagem(mensagemJson)
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
        if(connection) connection.invoke("EnviarMensagem", novaMensagem, idChatAtivo)
    }
    function handleFormChange(e : ChangeEvent<HTMLInputElement>){
        setNovaMensagem(e.target.value)
    }
    async function buscarChatsUsuario(){
        try{
           var chats = await axios.get("api/chat/mychats")
           console.log(chats.data)
           setIdChatAtivo(chats.data[0].id)
           setChatsUsuario(chats.data)
        }
        catch(error){
            console.log(error)
        }
        
    }
    async function buscarMensagensPorChat(idChat: number | undefined){
        try{
            console.log("id chat ativo: " + idChatAtivoRef.current)
            var response = await axios.get("api/chat/mensagens/"+idChat)
            setMensagens(response.data)
        }
        catch{}
    }
    function alterarChatAtivo(chatId : number){
        setIdChatAtivo(chatId);
    }
    function adicionarMensagem(mensagem : IMensagem){
        adicionarUltimaMensagemAoChat(mensagem)
        if(mensagem.chatId == idChatAtivoRef.current)
            setMensagens(mensagens => [...mensagens, mensagem])
        
    }
    function adicionarUltimaMensagemAoChat(mensagem : IMensagem){
        setChatsUsuario(chats => chats.map((chat) => chat.id == mensagem.chatId ? {...chat, ultimaMensagem: mensagem} : chat))
        console.log("Chat id" + mensagem.chatId)
        console.log(chatsUsuario.map((chat) => chat.id == mensagem.chatId ? {...chat, ultimaMensagem: mensagem} : chat))
    }
    return {mensagens, novaMensagem,buscarMensagensPorChat,enviarMensagemTeste, handleFormChange, chatsUsuario, alterarChatAtivo, idChatAtivo}
}