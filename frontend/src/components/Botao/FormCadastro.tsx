import Botao from "./Botao";
import styles from "./FormCadastro.module.css";
interface FormCadastroProp {

}

export default function FormCadastro() {
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
            <Botao carregando={false}>Meu botão</Botao>
        </form>
}