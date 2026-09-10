import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./Login.css";
import PainelDesktop from "./PainelDesktop";
import MobileHero from "./MobileHero";
import Input from "../../components/Input/Input";
import { IconeEmail } from "../../components/Icones/IconesInput";
import SocialIcons from "./SocialIcons";
import { type LoginState } from "./LoginState";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState<LoginState>({email:"",senha:""});
  
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
    const {name, value, type} = e.target;
    setLoginState((dadosMantidos) => ({
        ...dadosMantidos,
        [name] : type === 'number' ? Number(value) : value
    }))
  }
  const handleSubmit = () => {
    console.log("Dados: ", loginState)
  }
  return (
    <div className="login-page">
      {/* Auth layout container */}
      <div className="auth-layout">
        <PainelDesktop/>
        {/* Right panel – contains mobile hero and form */}
        <div className="right-panel">
        <MobileHero/>

          {/* Form – shared between desktop and mobile */}
          <div className="login-form">
            <div className="title-block">
              {/* Placeholder for Scambo logo – desktop size (visible on mobile as part of form) */}
              <div className="logo-desktop">Scambo</div>
              <h2 className="login-title">Bem-vindo de volta</h2>
              <p className="login-subtitle">Acesse sua conta para continuar</p>
            </div>
            <Input titulo="E-mail" name="email" icone={<IconeEmail/>} value={loginState.email} onChange={handleChange}/>
            <Input titulo="Senha" name="senha" value={loginState.senha} onChange={handleChange}/>

            {/* Forgot password */}
            <div className="forgot-password">
              <button type="button" className="forgot-password-button">
                Esqueci minha senha
              </button>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmit}
            >
              Entrar
            </button>
            <SocialIcons/>

            {/* Register prompt */}
            <p className="register">
              Não tem conta?{' '}
              <button type="button" onClick={() => navigate("/register")}>Cadastre-se</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
