import axios from 'axios';
import React, { useEffect, useState, type ChangeEvent, type SubmitEvent, type SubmitEventHandler } from 'react';
import type { Usuario } from "../types/Usuario";

interface IAnuncio {
    id?: number,
    anuncianteId?: number,
    titulo?: string,
    descricao?: string,
    estadoConservacao?: string,
    modalidade?: string,
    dataPublicacao?: Date,
    status?: string,
}

export function useAnuncio() {
    const [anuncioData, setAnuncioData] = useState<IAnuncio>()
    const [isLoading, setIsLoading] = useState(false)

    const handleCriarAnuncio = async (e : SubmitEvent<HTMLFormElement>, usuario: Usuario) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        setAnuncioData({
            titulo: formData.get('titulo') as string,
            descricao: formData.get('descricao') as string,
            estadoConservacao: formData.get('estadoConservacao') as string,
            modalidade: formData.get('modalidade') as string,
            dataPublicacao: new Date(),
            status: "aberto",
            anuncianteId: usuario.id,
        })
        try {
            setIsLoading(true)
            // if(anuncioData?.dataPublicacao == null){
            //     setAnuncioData({
            //             dataPublicacao: new Date(),
            //             status: "aberto",
            //             anuncianteId: usuario.id,
            //         })
            // }
            const request = await axios.post(import.meta.env.VITE_API_URL + "api/anuncio", anuncioData)
            console.log(request.statusText)
        }
        catch (error) {
            if(axios.isAxiosError(error)) {
                console.log(error.code)
                console.log(error.status)
            }
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleInputCriarAnuncio = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAnuncioData((dadosMantidos) => ({ ...dadosMantidos, [name]: value }))
    }
    const handleSelectCriarAnuncio = (e: ChangeEvent<HTMLSelectElement>) => {
        console.log("Teste")
        const { name, value } = e.target;
        setAnuncioData((dadosMantidos) => ({ ...dadosMantidos, [name]: value }))
    }
    // const defaultAnuncio:IAnuncio[] = []
    // const App = () => {}

    // const [anuncios, setAnuncios]: [IAnuncio[], (posts: IAnuncio[]) => void] = React.useState(defaultAnuncio);
    // const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    // const [error, setError]: [string, (error: string) => void] = React.useState("");

    // React.useEffect(() => {
    // axios
    //     .post<IAnuncio[]>(import.meta.env.VITE_API_URL + "api/anuncio");
    // }, []);

    return {handleCriarAnuncio, handleInputCriarAnuncio, handleSelectCriarAnuncio, isLoading}
}

