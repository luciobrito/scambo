import Botao from "../../components/Botao/Botao";
import styles from "./Cadastro.module.css";
import CadastroForm from "./forms/CadastroForm";
export default function Cadastro(){
    return <>
    <h1>Scambo</h1>
    <h2>Cadastro</h2>
    <div className = {styles.divCustom}>
        <CadastroForm children={undefined}></CadastroForm>
    </div>
    </>
}