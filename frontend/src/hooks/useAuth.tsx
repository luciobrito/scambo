import axios from "axios"
import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react"
import { checkAuth } from "../utils/isAuth"
import { useNavigate } from "react-router"

interface ILoginData {
    email: string,
    senha: string,
}
interface ICadastroData {
    email: string,
    nome : string,
    senha : string,
    senhaConfirmacao : string
}

export function useAuth() {
    const [loginData, setLoginData] = useState<ILoginData>({ email: "", senha: ""})
    const [cadastroData, setCadastroData] = useState<ICadastroData>({email:"",senha:"",senhaConfirmacao:"",nome:""})
    const [token, setToken] = useState()
    const [error, setError] = useState<string | null>()
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)
    
    const navigate = useNavigate()
    
    useEffect(() => {
        setIsAuth(checkAuth())
    }, [])
    useEffect(() => {
        if (token != null) {
            localStorage.setItem("token", token)
            setIsAuth(checkAuth())
            navigate(0)
        }
    }, [token])
    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;
        setLoginData((dadosMantidos) => ({ ...dadosMantidos, [name]: value }))
    }
    const handleLogin = async () => {
        setError(null)
        try {
            setIsLoading(true)
            const request = await axios.post(import.meta.env.VITE_API_URL + "api/auth/login", loginData)
            setToken(request.data.token)
        }
        catch (error ) {
            if(axios.isAxiosError(error))
                if(error.status == 401)
                    setError("Email ou senha incorretos.")
                else setError("Não foi possível efetuar login.")
        }
        finally{
            setIsLoading(false)
        }
    }
    const logout = () => {
        localStorage.removeItem("token")
        setIsAuth(false)
        navigate(0)
    }
    const handleCadastroInput = (e: ChangeEvent<HTMLInputElement>) =>{
        const { name, value } = e.target;
        setCadastroData((dadosMantidos) => ({ ...dadosMantidos, [name]: value }))
    }
    const handleCadastro = async(e : SubmitEvent<HTMLFormElement>) =>{
        e.preventDefault()
        setError(null)
        try {
            setIsLoading(true)
            const request = await axios.post(import.meta.env.VITE_API_URL + "api/auth/cadastro", cadastroData)
            setToken(request.data.token)
        }
        catch (error ) {
            if(axios.isAxiosError(error)){
                console.log(error.response?.data.message)
                if(error.status == 401)
                    setError("Email ou senha incorretos.")
                else setError(error.response?.data.message)
}
            }
        finally{
            setIsLoading(false)
        }
    }
    return { handleLogin, handleCadastro, handleInput, handleCadastroInput, isAuth, logout, error, isLoading }

}