export default function MobileHero(){
    return           <div className="login-hero">
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
              {/* Placeholder for Scambo logo – mobile size */}
              <div className="logo-mobile">Scambo</div>
              <p className="login-tagline">Troque. Doe. Conecte.</p>
            </div>
          </div>
}