import type React from "react"

interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    carregando: boolean,
    children: React.ReactNode,

}
export default function Botao({ carregando, children, ...rest }: BotaoProps) {
    return <button {...rest}>
        {carregando ? "Carregando..." : children}
    </button>
}