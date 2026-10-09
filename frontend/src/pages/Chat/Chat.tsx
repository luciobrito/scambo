import useHubMensangens from "../../hooks/useHubMensagens"

export default function Chat(){
    const {mensagens, enviarMensagemTeste, handleFormChange} = useHubMensangens();
    return <>
    <input type="text" name="" onChange={handleFormChange} id="" />
        <button onClick={enviarMensagemTeste}>Enviar teste</button>
    <ul>
        {mensagens.map((mensagem, index) => (
            <li key={index}>{mensagem}</li>
        ))}
    </ul>
    </>
}