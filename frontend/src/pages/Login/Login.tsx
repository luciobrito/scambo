
import { useNavigate } from "react-router";
import "./Login.css";
import PainelDesktop from "./PainelDesktop";
import MobileHero from "./MobileHero";
import Input from "../../components/Input/Input";
import { IconeCadeado, IconeEmail } from "../../components/Icones/IconesInput";
import { useAuth } from "../../hooks/useAuth";
import Botao from "../../components/Botao";

export default function LoginScreen() {
  const navigate = useNavigate();
  const {handleInput, handleLogin, error, isLoading} = useAuth();

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
            <Input titulo="E-mail" name="email" icone={<IconeEmail/>} placeholder="seu@email.com"  onChange={handleInput}/>
            <Input type="password" titulo="Senha" name="senha" icone={<IconeCadeado/>} placeholder="Digite sua senha"  onChange={handleInput}/>

            {/* Forgot password */}
            <div className="forgot-password">
              <button type="button" className="forgot-password-button">
                Esqueci minha senha
              </button>
            </div>
            <Botao
              type="button"
              className="btn-primary"
              onClick={handleLogin}
              carregando={isLoading}
            >
              Entrar
            </Botao>
            <p>
              {error }
            </p>
            {/* Register prompt */}
            <p className="register">
              Não tem conta?{' '}
              <button type="button" onClick={() => navigate("/cadastro")}>Cadastre-se</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
