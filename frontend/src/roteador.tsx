import { createBrowserRouter } from "react-router"
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import NovoItem from "./pages/NovoItem/NovoItem";
import Chat from "./pages/Chat/Chat";
import Produtos from "./pages/Produtos/Produtos";
import LayoutApp from "./components/LayoutApp/LayoutApp";
import Perfil from "./pages/Perfil/Perfil";
import Conversas from "./pages/Conversas/Conversas";

export const roteador = createBrowserRouter([
    {
        path:"/",
        element: <Home/>
    },
    {
        path:"/login",
        element: <Login/>
    },
    {
        path:"/cadastro",
        element: <Cadastro/>
    },
    {
        path: "item",
        children:[
            {path:"novo",
                element: <NovoItem/>
            }
        ]
    },
    {
        path:"chat",
        element: <Chat/>
    },
    {
        path: "app",
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