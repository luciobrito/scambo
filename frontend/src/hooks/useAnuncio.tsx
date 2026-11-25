import axios from 'axios';
import React, { useEffect, useState, type ChangeEvent, type SubmitEvent, type SubmitEventHandler } from 'react';

interface IAnuncio {
    Id?: number,
    Titulo?: string,
    Descricao?: string,
    EstadoConservacao?: string,
    Modalidade?: string,
    DataPublicacao?: Date,
    Status?: string
}

export default function useAnuncio() {
    const [anuncioData, setAnuncioData] = useState<IAnuncio>()
    const [isLoading, setIsLoading] = useState(false)

    const handleCriarAnuncio = async (e : SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        setAnuncioData({
            Titulo: formData.get('titulo') as string,
            Descricao: formData.get('descricao') as string,
            EstadoConservacao: formData.get('estado') as string,
            Modalidade: formData.get('modalidade') as string,
            DataPublicacao: new Date(),
            Status: "aberto",
        })
        try {
            setIsLoading(true)
            const request = await axios.post(import.meta.env.VITE_API_URL + "api/anuncio", anuncioData)
            console.log(request.statusText)
            console.log(anuncioData)
        }
        catch (error) {
            if(axios.isAxiosError(error)) {
                console.log(error.code)
                console.log(error.status)
                console.log(anuncioData)
            }
        }
        finally {
            setIsLoading(false)
        }
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

    return {handleCriarAnuncio, isLoading}
}

