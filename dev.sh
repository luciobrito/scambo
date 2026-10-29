#!/usr/bin/env bash
# Sobe o sistema inteiro para desenvolvimento: MySQL (Docker), API (.NET) e front-end (Vite).
#
# Uso:   ./dev.sh
# Parar: Ctrl+C encerra a API e o front-end. O MySQL continua rodando; para pará-lo:
#        docker compose -f .devcontainer/docker-compose.yml stop db
#
# Requisitos: Docker, .NET 10 SDK e Node.js. Detalhes em docs/GUIA_BACKEND.md.
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")" && pwd)"
PORTA_FRONT="${PORTA_FRONT:-5173}"   # única origem liberada no CORS da API (backend/ScamboApi/CORSPolicy.cs)
PORTA_API=5209                       # perfil "http" de backend/ScamboApi/Properties/launchSettings.json

porta_ocupada() { (echo > "/dev/tcp/127.0.0.1/$1") 2>/dev/null; }

# Docker: se o DOCKER_HOST atual não responder (ex.: apontando para o Podman), usa o socket padrão.
if ! docker info > /dev/null 2>&1 && [ -S /var/run/docker.sock ]; then
    export DOCKER_HOST=unix:///var/run/docker.sock
fi

# .NET: usa o do PATH ou o instalado em ~/.dotnet (script dotnet-install.sh).
DOTNET="$(command -v dotnet || echo "$HOME/.dotnet/dotnet")"
if [ ! -x "$DOTNET" ]; then
    echo "❌ .NET 10 SDK não encontrado. Veja docs/GUIA_BACKEND.md, seção 2."
    exit 1
fi
export PATH="$(dirname "$DOTNET"):$PATH"
export DOTNET_CLI_TELEMETRY_OPTOUT=1

if porta_ocupada "$PORTA_FRONT"; then
    echo "❌ A porta $PORTA_FRONT está ocupada por outro programa."
    echo "   O front precisa dela, porque é a única liberada no CORS da API."
    echo "   Veja quem está usando com: ss -ltnp | grep $PORTA_FRONT  (ou docker ps)"
    exit 1
fi

# Ao sair (Ctrl+C ou erro), encerra a API e o front iniciados por este script.
trap 'echo; echo "⏹  Encerrando API e front-end..."; kill 0' EXIT

echo "▶ Banco de dados (MySQL)..."
docker compose -f "$RAIZ/.devcontainer/docker-compose.yml" up -d db
until docker exec mysql mysqladmin ping -uroot -p123 --silent 2> /dev/null; do sleep 1; done

echo "▶ Aplicando migrations..."
(cd "$RAIZ/backend" && "$DOTNET" tool restore > /dev/null \
    && cd ScamboApi && "$DOTNET" tool run dotnet-ef database update > /dev/null)

if porta_ocupada "$PORTA_API"; then
    echo "▶ API já está rodando na porta $PORTA_API; usando a existente."
else
    echo "▶ API (.NET) em http://localhost:$PORTA_API ..."
    (cd "$RAIZ/backend/ScamboApi" && "$DOTNET" run --launch-profile http 2>&1 | sed -u 's/^/[api] /') &
    until porta_ocupada "$PORTA_API"; do sleep 1; done
fi

echo "▶ Front-end (Vite) em http://localhost:$PORTA_FRONT ..."
cd "$RAIZ/frontend"
[ -f .env ] || cp .env.example .env
[ -d node_modules ] || npm install
echo
echo "✅ Sistema no ar: http://localhost:$PORTA_FRONT/app/products  (Ctrl+C para encerrar)"
echo
npm run dev -- --port "$PORTA_FRONT" --strictPort
