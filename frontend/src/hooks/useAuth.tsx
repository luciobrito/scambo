import { useState } from "react"


type AuthStatus = 'auth' | 'guest' | 'expired'

export function useAuth(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [token, setToken] = useState("")

    const handleAuth = () =>{

    }
    const isAuth = () : boolean =>{
        var token = localStorage.getItem("token")
        
        return false
    }
}