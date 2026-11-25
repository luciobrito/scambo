import { createBrowserRouter, redirect } from "react-router"
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import NovoItem from "./pages/NovoItem/NovoItem";
import Chat from "./pages/Chat/Chat";
import Produtos from "./pages/Produtos/Produtos";
import LayoutApp from "./components/LayoutApp/LayoutApp";
import Perfil from "./pages/Perfil/Perfil";
import Conversas from "./pages/Conversas/Conversas";
import { useAuth } from "./hooks/useAuth";
import { checkAuth } from "./utils/isAuth";
import NovoAnuncio from "./pages/NovoAnuncio/NovoAnuncio";

export const roteador = createBrowserRouter([
    {
        path:"/login",
        middleware: [guestMiddleware],
        element: <Login/>
    },
    {
        path:"/cadastro",
        middleware: [guestMiddleware],
        element: <Cadastro/>
    },
    {
        path:"chat",
        middleware:[authMiddleware],
        element: <Chat/>
    },
    {
        path: "app",
        middleware: [authMiddleware],
        element: <LayoutApp/>,
        
        children:[
            {path:"products",
                element: <Produtos/>
            },
            {path:"profile",
                element: <Perfil/>
            },
            {path:"chat",
                element: <Conversas/>
            }
        ]
    },
    {
        path: "/anuncio/create",
        element: <NovoAnuncio/>

    }
]);

async function guestMiddleware(){
    
    if(checkAuth()){
        throw redirect('/app')
    }
    
}

async function authMiddleware(){
    if(!checkAuth()) throw redirect('/login')
}