import Botao from "../Botao";
import { InputField } from "../InputField";
import { fontes, cores } from "../../lib/pallete";
import React, {useState, type SubmitEvent} from 'react';
import useAnuncio from "../../hooks/useAnuncio";
import styles from "./FormAnuncio.module.css";

interface FormCadastroProps {
    
};

export default function FormAnuncio({}: FormCadastroProps) {
    const {handleCriarAnuncio, isLoading} = useAnuncio();

    const handleOnSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        handleCriarAnuncio(event)
    }


    const form = (
        <form id="formAnuncio" onSubmit={handleOnSubmit} className={styles.gridForms1}>
            <div className={styles.divInputs}>
                <InputField label={"Titulo"} name="titulo"/>
                <InputField label={"Descricao"} name="descricao"/>
                {/* <InputField label={"Imagem"} type="file"/> */}
                <label htmlFor="condicao">Condição:</label>
                <select id="condicao" name="estado" className={styles.customCombobox}>
                    <option value="novo">Novo</option>
                    <option value="pouco-usado">Pouco Usado</option>
                    <option value="usado">Usado</option>
                </select>
                <label htmlFor="tipo">Tipo</label>
                <select id="tipo"  name="modalidade" className={styles.customCombobox}>
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