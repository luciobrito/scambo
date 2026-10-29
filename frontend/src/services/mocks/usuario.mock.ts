import type { Perfil, Usuario } from "../usuario";

/*
 * Dados provisórios usados enquanto o back-end de usuário/perfil não existe.
 * Seguem exatamente os tipos de ../usuario.ts (o contrato com a API).
 * Usados enquanto VITE_MOCK_USUARIO não for "false" no frontend/.env (services/api.ts).
 * Remover este arquivo quando os endpoints estiverem prontos e integrados.
 */

export const usuarioLogadoMock: Usuario = {
    id: 1,
    nome: "Lucas Ferreira",
    nomeUsuario: "lucasferreira",
    cidade: "São Paulo, SP",
    membroDesde: "2025-01-15T00:00:00Z",
    bio: "Apaixonado por sustentabilidade e economia circular 🌱\nAdoro fazer scambos e dar nova vida a objetos!"
};

export const perfilMock: Perfil = {
    usuario: usuarioLogadoMock,
    estatisticas: { doacoes: 12, scambos: 8, avaliacao: 4.9 },
    scamboAtivo: {
        id: 10,
        titulo: "Cesta Artesanal Trançada",
        com: "Ana Souza",
        localizacao: "Caruaru, PE",
        data: "2026-10-20T00:00:00Z",
        status: "Em andamento",
        imagemUrl: "https://images.unsplash.com/photo-1760647832573-969bf71d12b8?w=80&h=80&fit=crop"
    },
    historico: [
        { id: 1, titulo: "Cestos Coloridos", com: "Maria Costa", data: "2026-08-10T00:00:00Z", status: "Concluído", imagemUrl: "https://images.unsplash.com/photo-1768102365363-d20d185b331e?w=120&h=120&fit=crop" },
        { id: 2, titulo: "Livros de Design", com: "Fernanda Reis", data: "2026-07-05T00:00:00Z", status: "Concluído", imagemUrl: "https://images.unsplash.com/photo-1763824371988-8c8eb3d13eff?w=120&h=120&fit=crop" },
        { id: 3, titulo: "Xícaras de Cerâmica", com: "Carlos Lima", data: "2026-06-18T00:00:00Z", status: "Concluído", imagemUrl: "https://images.unsplash.com/photo-1590605105526-5c08f63f89aa?w=120&h=120&fit=crop" },
    ],
    conquistas: [
        { id: 1, nome: "Primeiro Scambo", emoji: "🌱", conquistada: true },
        { id: 2, nome: "5 Doações", emoji: "🤝", conquistada: true },
        { id: 3, nome: "Top Doador", emoji: "⭐", conquistada: true },
        { id: 4, nome: "10 Scambos", emoji: "🔥", conquistada: false },
        { id: 5, nome: "Campeão", emoji: "🏆", conquistada: false },
        { id: 6, nome: "Diamante", emoji: "💎", conquistada: false },
    ]
};
