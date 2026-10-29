# Guia para o back-end

Este guia é para quem vai implementar o back-end do Scambo a partir das telas que o
front-end já fez. O objetivo é que você possa focar na API sem precisar descobrir
como o front funciona.

- **O que cada endpoint deve receber e devolver:** `docs/CONTRATO_API.md`.
- **Este arquivo:** como rodar tudo junto, por onde começar e o que ainda precisa ser decidido.

> O contrato é uma **proposta** do front-end, feita a partir das telas. Se algo não fizer
> sentido no back-end (banco, segurança, desempenho), ajuste junto com o front e atualize
> o `CONTRATO_API.md`. O importante é os dois lados seguirem o mesmo documento.

## 1. Como o front-end está organizado

As telas nunca chamam a API diretamente. Todas as chamadas passam por `frontend/src/services/`:

| Arquivo | Telas | Situação |
| --- | --- | --- |
| `services/anuncios.ts` | Produtos (`/app/products`) | já chama a API de verdade |
| `services/usuario.ts` | Sidebar e Perfil (`/app/profile`) | usa mock |
| `services/chat.ts` | Chat (`/app/chat`) | usa mock |

- Os dados provisórios ficam em `services/mocks/`, no mesmo formato do contrato.
- Cada ponto que depende do back-end tem um comentário `TODO(back-end)` com a chamada
  axios pronta, só comentada. Para listar todos:

  ```bash
  grep -rn "TODO(back-end)" frontend/src
  ```

- No back-end, os métodos que o front usa têm um comentário `TODO(front)` dizendo o que
  devem devolver:

  ```bash
  grep -rn "TODO(front)" backend/ScamboApi
  ```

Quando um endpoint ficar pronto, o front troca só o corpo da função no serviço; as telas
não mudam.

## 2. Rodando o front-end junto com a API

**Tudo de uma vez:** na raiz do repositório, `./dev.sh`. O script sobe o MySQL (Docker), aplica as
migrations, sobe a API e o front-end na porta 5173. O Ctrl+C encerra a API e o front;
`./parar.sh` encerra tudo, inclusive o MySQL (os dados do banco são mantidos).
Os passos abaixo são o que ele faz, caso prefira rodar cada parte separadamente.

1. **API:** em `backend/ScamboApi`, `dotnet run --launch-profile http`. Ela sobe em
   `http://localhost:5209` e precisa do MySQL de `appsettings.json` (`DefaultConnection`).
2. **Front-end:** em `frontend`, copie `.env.example` para `.env`
   (`VITE_API_URL=http://localhost:5209/`, com barra no final), rode `npm install` e `npm run dev`.
3. **CORS:** `CORSPolicy.cs` só libera `http://localhost:5173`. Se o Vite subir em outra
   porta (ele usa 5174, 5175... quando a 5173 está ocupada), a API bloqueia as chamadas.
   Rode o front na 5173 ou libere a porta usada.
4. **Testar sem o front:** use `ScamboApi.http` ou o OpenAPI em
   `http://localhost:5209/openapi/v1.json` (ambiente Development).

Telas para conferir: `/app/products`, `/app/chat`, `/app/profile` e `/login`.

## 3. Ordem sugerida

Cada etapa destrava uma parte das telas. Vale integrar e testar com o front ao fim de
cada uma, em vez de deixar tudo para o final.

### Etapa 1: feed de anúncios (`GET api/anuncio`)
É o melhor primeiro passo: o front de Produtos já chama esse endpoint, então ele valida
CORS, `VITE_API_URL` e o formato do JSON antes do resto.
- [ ] `ObterTodos` devolve um **array** de anúncios do banco (hoje devolve um texto).
- [ ] Campos opcionais que o card usa: `categoria`, `localizacao`, `fotoUrlAnuncio`, `nomeDoador`.
      Ainda não existem no modelo `Anuncio`; sem eles o card só não mostra essas informações.
- [ ] A tela `/app/products` mostra os itens, a busca e as categorias funcionam.

### Etapa 2: autenticação e usuário logado
Perfil e Chat dependem de saber **quem** está logado (por isso os endpoints usam `me`).
- [ ] Definir o mecanismo com o time (ver seção 4).
- [ ] Endpoint de login e `GET api/usuarios/me`.
- [ ] O cadastro (`POST api/usuarios`) já salva no banco. Ajustes em `CONTRATO_API.md` (resposta sem senha, erros 400/409).

### Etapa 3: perfil
- [ ] `GET api/usuarios/me/perfil` (estatísticas, scambo ativo, histórico, conquistas).
- [ ] `PATCH api/usuarios/me` para a bio.

### Etapa 4: chat (REST)
- [ ] `GET api/chat/conversas`, `GET api/chat/mensagens/{idConversa}`, `POST api/chat/enviar`,
      `PUT api/chat/mensagens/{idConversa}/visualizadas`.
- [ ] `POST api/chat/conversas` para iniciar a conversa a partir de um anúncio. É o que vai
      habilitar o botão "Confirmar Scambo" da tela de Produtos.

### Etapa 5: chat em tempo real (SignalR)
- [ ] Grupos por conversa no `HubMensagens` (`EntrarConversa` / `SairConversa`).
- [ ] Evento `ReceberMensagem` com o objeto `Mensagem` completo, só para a conversa.

### Como saber que um endpoint está pronto
- O JSON segue o `CONTRATO_API.md`: nomes em camelCase, datas em ISO 8601, listas como array.
- Erros voltam com o status certo (400, 401, 404, 409...) e, quando fizer sentido,
  `{ "mensagem": "texto para o usuário" }`.
- Nenhuma resposta inclui `senha`.
- O front foi avisado para trocar o mock pela chamada real.

## 4. Decisões em aberto (combinar com o time)

1. **Autenticação:** JWT no header `Authorization` ou cookie de sessão? Afeta todas as chamadas
   do front (onde guardar o token, como enviar, o que fazer no `401`) e o botão Sair, que hoje
   só volta para `/login`.
2. **Campos novos nos modelos:**
   - `Anuncio`: categoria, localização, fotos e quem publicou (dono).
   - `Usuario`: nome de usuário (`@lucasferreira`), cidade, bio, data de cadastro.
3. **Participantes do chat:** `Chat` hoje tem só `Remetente` e `Anuncio`. Para listar
   "minhas conversas" e saber quem é o contato, a conversa precisa dos dois usuários.
   Pode ser pelo dono do anúncio, desde que `Anuncio` passe a ter um dono.
4. **Status do scambo** (Em andamento, Concluído, Cancelado): onde fica guardado? Ainda não
   existe modelo para isso, e as telas de Perfil e Chat exibem esse status.
5. **Estatísticas e conquistas do perfil:** calculadas a cada consulta ou guardadas?
6. **"Online" no chat:** usar as conexões do SignalR ou enviar sempre `false` por enquanto.

## 5. Observações encontradas no código atual

O front-end **não alterou** o comportamento do back-end. Estes pontos foram vistos durante
a integração e ficam registrados aqui:

- **Senha:** `UsuariosController.CriarUsuario` grava a senha como foi digitada (sem hash) e
  devolve o DTO com a senha na resposta `201`.
- **CORS:** só `http://localhost:5173` está liberada (ver seção 2).
- **Imagens:** `storageConnectionString` está vazio em `Program.cs`. Chamadas a
  `api/imagens` devem falhar até ele ser configurado. O front de Produtos busca as fotos
  em `api/imagens/{caminho}`.
- **Anúncios:** `CriarAnuncio`, `AtualizarAnuncio` e `DeletarAnuncio` ainda não acessam o banco.
- **SignalR:** `HubMensagens.EnviarMensagem` usa `Clients.All` (todos recebem tudo).
- **Sobras de template:** `WeatherForecastController.cs` e `WeatherForecast.cs`.

## 6. Pendências do lado do front-end

Para o back-end saber o que **não** precisa esperar dele:

- O link "Cadastre-se" da tela de Login aponta para `/register`, mas a rota é `/cadastro`.
- A tela de Cadastro nova está no branch `feature_pedro`, ainda não mesclada. Esse branch
  também move `src/pallete.ts` para `src/lib/paleta.ts`, o que exige ajustar os imports das
  telas novas ao mesclar.
- O botão "Confirmar Scambo" (Produtos) espera o `POST api/chat/conversas` (etapa 4).
- Enviar imagem no chat, notificações e as opções de Configurações do perfil ficam
  desabilitados com "em breve".
