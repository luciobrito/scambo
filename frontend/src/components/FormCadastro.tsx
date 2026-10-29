import { useState } from "react";
import { InputField } from "./InputField";
import { Navigate, useNavigate, type NavigateFunction } from "react-router";
import { fontes, cores } from "../lib/pallete";
import styles from "./FormCadastro.module.css"
import { formToJSON } from "axios";

interface FormCadastroProps {
    isDesktop: boolean
};

export default function FormCadastro({isDesktop}: FormCadastroProps) {
   
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitForm(navigate, name, email, password, confirm, agreed);
    }

    const form = (
        
        <form id="formCadastro" action="" onSubmit={handleSubmit} className={styles.mainFormsStyle}>
            <div className={isDesktop ? styles.gridForms1 : styles.gridForms2}>
                
                <InputField label="Nome completo" placeholder="Seu nome" value={name} onChange={setName}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cores.palmLeaf} strokeWidth="2" strokeLinecap="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>} />
                <InputField label="E-mail" type="email" placeholder="seu@email.com" value={email} onChange={setEmail}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cores.palmLeaf} strokeWidth="2" strokeLinecap="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>} />
                <InputField label="Senha" type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={setPassword}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cores.palmLeaf} strokeWidth="2" strokeLinecap="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>} />
                <InputField label="Confirmar senha" type="password" placeholder="Repita a senha" value={confirm} onChange={setConfirm}
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cores.palmLeaf} strokeWidth="2" strokeLinecap="round">
                        <path d="M20 6 9 17l-5-5" />
                    </svg>} />
            </div>
            <div className={styles.divDireitos}>
                <button onClick={() => setAgreed(!agreed)}
                    className={styles.btnTermos}
                    style={{  background: agreed ? cores.sageGreen : "transparent", border: agreed ? "none" : `2px solid ${cores.drySage}` }}>
                    {agreed && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                </button>
                <p style={{ fontFamily: fontes.sans, fontSize: 12, color: cores.palmLeaf, lineHeight: 1.6 }}>
                    Concordo com os{" "}
                    <span style={{ color: cores.sageGreen, fontWeight: 600 }}>Termos de Uso</span> e a{" "}
                    <span style={{ color: cores.sageGreen, fontWeight: 600 }}>Política de Privacidade</span>
                </p>
            </div>
            <div className={isDesktop ? styles.divBotoes1 : styles.divBotoes2}>
                {isDesktop && (
                <button onClick={() => navigate("/login")}
                    className={styles.btn}
                    style={{ fontFamily: fontes.sans, fontSize: 14, background: "transparent", color: cores.palmLeaf, border: `1.5px solid ${cores.drySage}`, cursor: "pointer" }}>
                    Já tenho conta
                </button>
                )}
                <button type="submit"  className={styles.btn} style={{ fontFamily: fontes.sans, fontSize: 15, background: cores.sandyBrown, color: "#fff", border: "none", cursor: "pointer", boxShadow: `0 6px 20px rgba(245,166,91,0.45)` }}>
                Criar conta
                </button>
            </div>
            
        </form>
    );

    return form;
}

function submitForm(navigate: NavigateFunction ,nome: string, email: string, password: string, confPassword: string, termos: boolean) {
    if(validarCampos(nome, email, password, confPassword, termos)){
        navigate("/");
    }
    
}

function validarCampos(nome: string, email: string, password: string, confPassword: string, termos: boolean){
    const formValido = (!(isCampoEmpty(nome) || isCampoEmpty(email) || isCampoEmpty(password) || isCampoEmpty(confPassword)) && termos)
    return formValido;
}

function isCampoEmpty(input: string){
    return (input.trim().length == 0);
}


