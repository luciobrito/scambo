import Botao from "../../components/Botao/Botao";
import FormCadastro from "../../components/Botao/FormCadastro";
import styles from "./Cadastro.module.css";
export default function Cadastro(){
    return <>
    <h1>Scambo</h1>
    <h2>Cadastro</h2>
    <div className = {styles.divCustom}>
        <FormCadastro></FormCadastro>
                    

    </div>
    </>
}