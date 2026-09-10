import type { ReactElement } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
    titulo : string,
    icone?: ReactElement  
}

export default function Input({titulo, icone, ...rest}:InputProps){
    return             <div className="input-field">
              <label htmlFor="email" className="input-label">
                {titulo}
              </label>
              <div className="input-wrapper">
                {icone}
                <input
                  {...rest}
                />
              </div>
            </div>
}