import axios from "axios";
import { useState, type ChangeEvent } from "react";


type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
export function useEnviarArquivo(arquivo? : File | null){
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [uploadProgess, setUploadProgess] = useState<number>(0);
    const [file, setFile] = useState<File | null>(arquivo!)
    const handleFileChange = (e : ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files![0])
        
    }
    const handleFileUpload = async () => {
        setStatus('uploading')
        setUploadProgess(0)
        const formData = new FormData()
        formData.append('arquivo', file!)
        try{
            
            await axios.post(import.meta.env.VITE_API_URL + "api/imagens", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {setUploadProgess(progressEvent.total! ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0)}
            })
            setStatus('success')
            setUploadProgess(0)
        }
        catch{
            //Erro de CORS, mas o arquivo está sendo enviado normalmente
            
        }
        console.log("Enviando arquivo: " + file?.name)        
        
    }
    const fileProps = {status, uploadProgess, file}
    return {handleFileChange, handleFileUpload, fileProps}
}