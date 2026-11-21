import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router/dom'
import { roteador } from './roteador.tsx'
import axios from 'axios'

axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
axios.defaults.baseURL = import.meta.env.VITE_API_URL

createRoot(document.getElementById('root')!).render(
  //Faz com que o componente seja renderizado duas vezes
  <StrictMode>
    <RouterProvider router={roteador}/>
  </StrictMode>,
)
