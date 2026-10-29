# Contrato front-end ↔ back-end

O front-end foi construído antes do back-end de usuário, perfil e chat. Este documento
lista o que as telas esperam da API, para que o back-end possa ser implementado
sem mudanças nas telas.

- Base: `VITE_API_URL` (ex.: `http://localhost:5209/`, com barra no final).
- JSON em **camelCase** (padrão do ASP.NET Core / System.Text.Json).
- Datas em **ISO 8601** (ex.: `"2025-01-15T00:00:00Z"`).
- Erros: status HTTP adequado (400, 401, 403, 404, 409, 500) e, quando houver texto para o
  usuário, corpo `{ "mensagem": "..." }`. O front exibe essa mensagem como está.
- Nenhuma resposta inclui `senha`.
- Os tipos TypeScript de referência estão nos arquivos indicados em cada seção.

## Situação atual

Atualizado em 28/10/2026. Ordem sugerida de implementação em `docs/GUIA_BACKEND.md`.

| Funcionalidade | Endpoint | Front-end | Back-end (arquivo) |
| --- | --- | --- | --- |
| Cadastro | `POST api/usuarios` | tela nova no branch `feature_pedro`, ainda sem integração | **funciona** (`UsuariosController.CriarUsuario`) |
| Login / sessão | a definir | tela pronta, sem integração | a fazer |
| Feed de produtos | `GET api/anuncio` | **integrado** (`services/anuncios.ts`) | retorna texto fixo (`AnuncioController.ObterTodos`) |
| Usuário logado | `GET api/usuarios/me` | usando mock | a fazer (`UsuariosController`) |
| Perfil | `GET api/usuarios/me/perfil` | usando mock | a fazer (`UsuariosController`) |
| Editar bio | `PATCH api/usuarios/me` | usando mock | a fazer (`UsuariosController`) |
| Lista de conversas | `GET api/chat/conversas` | usando mock | a fazer (`ChatController`) |
| Mensagens da conversa | `GET api/chat/mensagens/{idConversa}` | usando mock | rota existe, retorna texto fixo (`ChatController`) |
| Enviar mensagem | `POST api/chat/enviar` | usando mock | rota existe, não salva (`ChatController`) |
| Iniciar conversa (Confirmar Scambo) | `POST api/chat/conversas` | botão desabilitado, aguardando | a fazer (`ChatController`) |
| Marcar como lida | `PUT api/chat/mensagens/{idConversa}/visualizadas` | usando mock | a fazer (`ChatController`) |
| Tempo real | SignalR `/hubmensagens` | preparado (`assinarMensagens`) | envia string para todos (`Services/HubMensagens.cs`) |

As chamadas reais já estão implementadas em `frontend/src/services/`. Enquanto os endpoints
não existem, as telas usam os dados de exemplo de `frontend/src/services/mocks/`. Para usar a
API real num módulo, defina `VITE_MOCK_USUARIO=false` ou `VITE_MOCK_CHAT=false` no `frontend/.env`.

Os tipos TypeScript citados abaixo ficam em `frontend/src/services/`.

## `POST api/usuarios` (cadastro)

Já implementado. Corpo atual (`DTOs/UsuarioRegistroDTO.cs`):

```json
{ "nome": "Lucas Ferreira", "email": "lucas@email.com", "senha": "********" }
```

- Resposta esperada pelo front: `201` **sem a senha** no corpo (hoje o endpoint devolve o DTO recebido, incluindo `senha`).
- Erros esperados: `400` para dados inválidos e `409` para e-mail já cadastrado, com `{ "mensagem": "texto para o usuário" }`.

## `GET api/anuncio`

Tipo: `AnuncioApi` em `src/services/anuncios.ts`. Deve retornar um **array**.

```json
[
  {
    "id": 1,
    "titulo": "Cesta Artesanal Trançada",
    "descricao": "Cesta em palha de buriti feita à mão.",
    "estadoConservacao": "Bom",
    "modalidade": "Doação",
    "dataPublicacao": "2026-10-28T10:00:00Z",
    "status": "Ativo",
    "categoria": "Materiais",
    "localizacao": "Caruaru, PE",
    "fotoUrlAnuncio": ["cesta-123.jpg"],
    "nomeDoador": "Ana Souza"
  }
]
```

- Os campos `id`, `titulo`, `descricao`, `estadoConservacao`, `modalidade`, `dataPublicacao` e `status` já existem em `Models/Anuncio.cs`.
- Os campos `categoria`, `localizacao`, `fotoUrlAnuncio` e `nomeDoador` ainda não existem no modelo. São opcionais: sem eles, o card só não exibe essas informações.
- `categoria`: `Roupas`, `Eletrônicos`, `Livros`, `Materiais` ou `Outros`. Qualquer outro valor é tratado como `Outros`.
- `fotoUrlAnuncio`: URLs absolutas ou nomes de arquivo servidos por `GET api/imagens/{caminho}`. O card usa só a primeira.

## `GET api/usuarios/me`

Usado na sidebar. Tipo: `Usuario` em `src/services/usuario.ts`.

```json
{
  "id": 1,
  "nome": "Lucas Ferreira",
  "nomeUsuario": "lucasferreira",
  "cidade": "São Paulo, SP",
  "membroDesde": "2025-01-15T00:00:00Z",
  "fotoPerfilUrl": null,
  "bio": "Apaixonado por sustentabilidade e economia circular 🌱"
}
```

- Não retornar `senha` nem `email` nesta resposta.
- `nomeUsuario` (exibido como `@lucasferreira`), `cidade`, `membroDesde` e `bio` ainda não existem em `Models/Usuario.cs`.

## `GET api/usuarios/me/perfil`

Usado na tela `/app/profile`. Tipo: `Perfil` em `src/services/usuario.ts`.

```json
{
  "usuario": { "...": "mesmo formato de GET api/usuarios/me" },
  "estatisticas": { "doacoes": 12, "scambos": 8, "avaliacao": 4.9 },
  "scamboAtivo": {
    "id": 10,
    "titulo": "Cesta Artesanal Trançada",
    "com": "Ana Souza",
    "localizacao": "Caruaru, PE",
    "data": "2026-10-20T00:00:00Z",
    "status": "Em andamento",
    "imagemUrl": "https://..."
  },
  "historico": [
    { "id": 1, "titulo": "Cestos Coloridos", "com": "Maria Costa", "data": "2026-08-10T00:00:00Z", "status": "Concluído", "imagemUrl": "https://..." }
  ],
  "conquistas": [
    { "id": 1, "nome": "Primeiro Scambo", "emoji": "🌱", "conquistada": true }
  ]
}
```

- `scamboAtivo` pode ser `null` (a seção não é exibida).
- `status`: `Em andamento`, `Concluído` ou `Cancelado`.
- `avaliacao`: média de 0 a 5.

## `PATCH api/usuarios/me`

Corpo: `{ "bio": "texto" }` (até 300 caracteres). Resposta esperada: `204 No Content`.

## Chat

Usado na tela `/app/chat`. Tipos: `Conversa` e `Mensagem` em `src/services/chat.ts`.
As tabelas `Chats` e `Mensagens` já existem (`Models/Chat.cs`, `Models/Mensagem.cs`).

### `GET api/chat/conversas`

Conversas do usuário logado, em qualquer ordem (o front ordena pela última mensagem).

```json
[
  {
    "id": 1,
    "contato": { "id": 2, "nome": "Ana Souza", "online": true },
    "anuncio": { "id": 1, "titulo": "Cesta Artesanal Trançada", "imagemUrl": "https://..." },
    "statusScambo": "Em andamento",
    "ultimaMensagem": { "id": 6, "conversaId": 1, "remetenteId": 2, "conteudo": "Posso mandar foto agora mesmo", "dataHora": "2026-10-28T14:32:00Z", "visualizada": false },
    "naoLidas": 2
  }
]
```

- `contato`: a outra pessoa da conversa (não o usuário logado).
- `statusScambo`: `Em andamento`, `Concluído`, `Cancelado` ou `null` (sem scambo combinado).
- `online`: se não for possível saber, enviar `false`.

### `POST api/chat/conversas` (proposta)

Inicia (ou reabre) a conversa do usuário logado com o dono de um anúncio. Vai ser chamado
pelo botão **Confirmar Scambo** da tela de Produtos, que hoje fica desabilitado.

Corpo: `{ "anuncioId": 1 }`. Resposta: `201` (ou `200`, se a conversa já existir) com a
`Conversa` no mesmo formato de `GET api/chat/conversas`. Depois disso, o front abre `/app/chat`
nessa conversa.

### `GET api/chat/mensagens/{idConversa}`

Mensagens da conversa, em qualquer ordem (o front ordena por `dataHora`).

```json
[
  { "id": 1, "conversaId": 1, "remetenteId": 2, "conteudo": "Oi! Tenho interesse na sua cesta 🌿", "dataHora": "2026-10-28T14:28:00Z", "visualizada": true }
]
```

- O front decide de que lado mostrar a mensagem comparando `remetenteId` com o `id` de `GET api/usuarios/me`.
  Por isso a mensagem traz o `remetenteId`, e não um campo "é minha".

### `POST api/chat/enviar`

Corpo: `{ "conversaId": 1, "conteudo": "texto" }` (até 1000 caracteres).
O remetente vem da sessão. Resposta: `201` com a `Mensagem` criada (mesmo formato acima).

### `PUT api/chat/mensagens/{idConversa}/visualizadas`

Marca como visualizadas as mensagens recebidas na conversa. Resposta: `204 No Content`.

### Tempo real (SignalR `/hubmensagens`)

Hoje `HubMensagens.EnviarMensagem` recebe uma string e envia para **todos** os clientes.
O front espera:

- Métodos chamados pelo cliente: `EntrarConversa(conversaId)` e `SairConversa(conversaId)`
  (sugestão: um grupo do SignalR por conversa, ex.: `conversa-1`).
- Evento enviado pelo servidor: `ReceberMensagem` com o objeto `Mensagem` (não só o texto),
  para os membros do grupo da conversa, sempre que uma mensagem for salva.

A integração no front fica em `assinarMensagens` (`src/services/chat.ts`), já chamada pela tela.

## Autenticação

Ainda não definida. Quando existir, as chamadas acima devem identificar o
usuário pela sessão/token (por isso `me`), e o botão **Sair** do perfil
(`src/pages/Perfil/Perfil.tsx`, `TODO(back-end)`) deve limpar essa sessão.
Lembrar de liberar no CORS (`CORSPolicy.cs`) a porta usada pelo front em
desenvolvimento.
