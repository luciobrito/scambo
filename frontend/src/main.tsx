import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router/dom'
import { roteador } from './roteador.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={roteador}/>
  </StrictMode>,
)
