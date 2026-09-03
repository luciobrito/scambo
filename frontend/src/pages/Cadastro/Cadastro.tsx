import styles from "./Cadastro.module.css";
export default function Cadastro(){
    return <>
    <h1>Escambo</h1>
    <h2>Cadastro</h2>
    <div className = {styles.divCustom}>
        <form className={styles.formCustom}>
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

            <button id="btnCadastrar" >Cadastrar</button>
        </form>
    </div>
    </>
}