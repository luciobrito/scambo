import Botao from "../Botao";
import { InputField } from "../InputField";
import { fontes, cores } from "../../lib/pallete";
import React, {useState, type SubmitEvent} from 'react';
import { useAnuncio } from "../../hooks/useAnuncio";
import { useUserData } from "../../hooks/useUserData";
import styles from "./FormAnuncio.module.css";
import type { Usuario } from "../../types/Usuario";

interface FormCadastroProps {
    
};

export default function FormAnuncio({}: FormCadastroProps) {
    const {handleCriarAnuncio, handleInputCriarAnuncio, handleSelectCriarAnuncio, isLoading} = useAnuncio();
    const {usuario} = useUserData()

    const handleOnSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        if (usuario != undefined)
            handleCriarAnuncio(event, usuario)
    }

    const teste = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log("foi")
    } 
    const form = (
        <form id="formAnuncio" onSubmit={handleOnSubmit} className={styles.gridForms1} >
            <div className={styles.divInputs}>
                <InputField label={"Titulo"} name="titulo" onChange={handleInputCriarAnuncio}/>
                <InputField label={"Descricao"} name="descricao" onChange={handleInputCriarAnuncio}/>
                {/* <InputField label={"Imagem"} type="file"/> */}
                <label htmlFor="estadoConservacao">Condição:</label>
                <select id="estadoConservacao" name="estadoConservacao" className={styles.customCombobox}>
                    <option value="novo">Novo</option>
                    <option value="pouco-usado">Pouco Usado</option>
                    <option value="usado">Usado</option>
                </select>
                <label htmlFor="tipo">Tipo</label>
                <select id="tipo"  name="modalidade" className={styles.customCombobox} onSelect={handleSelectCriarAnuncio}>
                    <option value="tipo1">Tipo 1</option>
                    <option value="tipo2">Tipo 2</option>
                    <option value="tipo3">Tipo 3</option>
                </select>
            </div>
            <div>
                <Botao carregando={false}  type="submit"  style={{ fontFamily: fontes.sans, fontSize: 15, background: cores.sandyBrown, color: "#fff", border: "none", cursor: "pointer", boxShadow: `0 6px 20px rgba(245,166,91,0.45)` }}>
                Salvar
                </Botao>
            </div>
        </form>
    )
    
    return form;

}