import Botao from "../../../components/Botao/Botao";
import styles from "./CadastroForm.module.css";

interface CadastroFormProps extends React.FormHTMLAttributes<HTMLFormElement>{
    
    children: React.ReactNode,
}

export default function CadastroForm({children} : CadastroFormProps){
    return <form className={styles.formCustom}>
            <label htmlFor="inputNome">Nome:</label>
            <input id="inputNome" type="text" />

            <label htmlFor="inputEmail">Email:</label>
            <input id="inputEmail" type="email" />

            <label htmlFor="inputTelefone">Telefone:</label>
            <input id="inputTelefone" type="text" />

            <label htmlFor="inputSenha">Senha:</label>
            <input id="inputSenha" type="password" />

            <label htmlFor="inputConfirmarSenha">Confirmar Senha:</label>
            <input id="inputConfirmarSenha" type="password" />
            <Botao carregando={false}>Cadastrar-se</Botao>
        </form>
                 
}