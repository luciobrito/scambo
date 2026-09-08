export default function PainelDesktop(){
    return         <div className="left-panel">
          {/* Decorative circles */}
          <div className="circle-1" />
          <div className="circle-2" />
          <div className="circle-3" />
          <div className="hero-inner">
            <div className="hero-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 1l4 4-4 4" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <path d="M7 23l-4-4 4-4" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </div>
            {/* Desktop logo – white */}
            <div className="logo-desktop-white">Scambo</div>
            <p className="login-tagline">Troque. Doe. Conecte.</p>
            {/* Emoji taglines */}
            <div className="tagline-list">
              <div className="tagline-item">
                <div className="emoji-box">🌿</div>
                <p className="emoji-text">Mais de 240 itens disponíveis para doação</p>
              </div>
              <div className="tagline-item">
                <div className="emoji-box">🤝</div>
                <p className="emoji-text">Conecte-se com sua comunidade local</p>
              </div>
              <div className="tagline-item">
                <div className="emoji-box">♻️</div>
                <p className="emoji-text">Pratique a economia circular</p>
              </div>
            </div>
          </div>
          <footer className="left-footer">© 2026 Scambo · Todos os direitos reservados</footer>
        </div>
}