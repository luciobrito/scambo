import { useEffect, useState, type ChangeEvent } from "react";
import  * as signalR from '@microsoft/signalr'
export default function useHubMensangens(){
    const [connection, setConnection] = useState<signalR.HubConnection>();
    const [mensagens, setMensagens] = useState<String[]>([]);
    const [novaMensagem, setNovaMensagem] = useState<String>();
    useEffect(()=>{
        const newConnection = new signalR.HubConnectionBuilder().withUrl(import.meta.env.VITE_API_URL + 'hubmensagens', {}).withAutomaticReconnect().build();
        setConnection(newConnection)
        
    },[])
    useEffect(()=>{
        if(connection){
            connection.start().then(()=>{
                connection.invoke("GetConnectionId").then(id => console.log("id: ", id))
                connection.on("ReceberMensagem", (mensagem)=> setMensagens(mensagens => [...mensagens, mensagem]))
                
            })
            
        
        }
    },[connection])
    function enviarMensagemTeste(){
        console.log(mensagens)
        if(connection) connection.invoke("EnviarMensagem", novaMensagem)
    }
    function handleFormChange(e : ChangeEvent<HTMLInputElement>){
        setNovaMensagem(e.target.value)
    }
    return {mensagens, enviarMensagemTeste, handleFormChange}
}