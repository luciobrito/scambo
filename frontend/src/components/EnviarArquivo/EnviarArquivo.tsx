import { useEnviarArquivo } from "../../hooks/useEnviarArquivo";

export default function EnviarArquivo(){
    const {handleFileChange, handleFileUpload, fileProps} = useEnviarArquivo();
    
    return <div>
        <input type="file" name="" onChange={handleFileChange} />
        <p>{fileProps.file?.name}</p>
        <button onClick={handleFileUpload}>Enviar</button>
    </div>
}