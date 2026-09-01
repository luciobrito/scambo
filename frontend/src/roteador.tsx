import { createBrowserRouter } from "react-router"
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";

export const roteador = createBrowserRouter([
    {
        path:"/",
        element: <Home/>
    },
    {
        path:"/login",
        element: <Login/>
    }
]);