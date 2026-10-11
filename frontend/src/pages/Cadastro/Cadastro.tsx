import { useNavigate } from "react-router";
import { cores, fontes } from "../../lib/paleta";
import { ScamboLogo } from "../../components/ScamboLogo";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import styles from "./Cadastro.module.css";
import FormCadastro from "../../components/FormCadastro";

export default function Cadastro(){
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const tela = (
    <div className={styles.divPrincipal} style={{background: cores.bg}}>
      {/* Cabeçalho + btn voltar BtnVoltar */}
      {!isDesktop && (
        <div className={styles.divLogoMobile}>
          <button onClick={() => navigate("/login")}
            className={styles.btnCabecalhoMobile}
            style={{ background: cores.card, border: `1.5px solid ${cores.drySage}` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cores.dark} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <ScamboLogo size={26} />
        </div>
      )}

      {/*Texto criar conta*/} 
      <div>
        {isDesktop && <ScamboLogo size={36} />}
        <h2 style={
          { fontFamily: fontes.serif, fontWeight: 700, fontSize: isDesktop ? 28 : 26, color: cores.dark, lineHeight: 1.2, marginTop: isDesktop ? 16 : 0 }
          }>
          Criar sua conta
        </h2>
        <p style={{ fontFamily: fontes.sans, fontSize: 13, color: cores.palmLeaf, marginTop: 4 }}>
          Junte-se à comunidade Scambo
        </p>
      </div>

      {/* Avatar */}
      <div className={styles.divAvatar}>
        <div className={styles.subdivAvatar}>
          <div className={styles.iconFotoAvatar}
            style={{ background: cores.drySage, border: `2.5px dashed ${cores.palmLeaf}` }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={cores.palmLeaf} strokeWidth="1.8" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span style={{ fontFamily: fontes.sans, fontSize: 9, color: cores.palmLeaf, fontWeight: 700 }}>FOTO</span>
          </div>
          <div className={styles.btnAddFotoAvatar}
            style={{ background: cores.sandyBrown }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        </div>
      </div>

     
      <FormCadastro isDesktop={isDesktop}></FormCadastro>
      {!isDesktop && (
                <p className="text-center" style={{fontFamily: fontes.sans, fontSize: 13, color: cores.palmLeaf }}>
                Já tem conta?{" "}
                <button onClick={() => navigate("/login")}
                    style={{ color: cores.sageGreen, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
                    Entrar
                </button>
                </p>
            )}
    </div>
    );
    return tela;
}
