/// <reference types="vite/client" />

// Variáveis de ambiente do front-end (frontend/.env; modelo em frontend/.env.example).
interface ImportMetaEnv {
    // URL da API com barra no final, ex.: "http://localhost:5209/".
    readonly VITE_API_URL: string,
    // "false" para usar a API real em vez dos dados de exemplo do módulo.
    readonly VITE_MOCK_USUARIO?: string,
    readonly VITE_MOCK_CHAT?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
