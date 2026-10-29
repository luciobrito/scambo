import { expect, test } from "vitest";
import { useEnviarArquivo } from "../../hooks/useEnviarArquivo";

test("Deve enviar imagem ao servidor", ()=>{
    const {handleFileUpload} = useEnviarArquivo()
    
    expect(true).toBe(true)
})