import { createBrowserRouter, redirect } from "react-router"
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import Produtos from "./pages/Produtos/Produtos";
import LayoutApp from "./components/LayoutApp/LayoutApp";
import Perfil from "./pages/Perfil/Perfil";
import Conversas from "./pages/Conversas/Conversas";
import { checkAuth } from "./utils/isAuth";

export const roteador = createBrowserRouter([
    {
        path:'',
        middleware: [redirectApp]
    },
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
async function redirectApp(){
    throw redirect('/app')
}