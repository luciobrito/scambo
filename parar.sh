#!/usr/bin/env bash
# Para o sistema iniciado pelo ./dev.sh: front-end (Vite), API (.NET) e MySQL (Docker).
#
# Uso: ./parar.sh
#
# Só encerra processos que rodam a partir desta pasta do projeto, para não derrubar outro
# programa que esteja usando as mesmas portas. Os dados do banco são mantidos (volume Docker).
set -uo pipefail

RAIZ="$(cd "$(dirname "$0")" && pwd)"
PORTA_FRONT="${PORTA_FRONT:-5173}"
PORTA_API=5209

# Encerra o processo que escuta na porta, se ele for deste projeto.
parar_porta() {
    local porta="$1" nome="$2" pid pasta
    pid="$(ss -ltnpH "sport = :$porta" 2> /dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2)"
    if [ -z "$pid" ]; then
        # Porta em uso sem processo visível: pertence a outro usuário (ex.: container Docker).
        if (echo > "/dev/tcp/127.0.0.1/$porta") 2> /dev/null; then
            echo "• $nome: a porta $porta está em uso por outro programa; nada foi encerrado."
        else
            echo "• $nome: não estava rodando."
        fi
        return
    fi
    pasta="$(readlink "/proc/$pid/cwd" 2> /dev/null || true)"
    if [[ "$pasta" != "$RAIZ"* ]]; then
        echo "• $nome: a porta $porta está em uso por outro programa (pid $pid); nada foi encerrado."
        return
    fi
    kill "$pid" && echo "⏹  Encerrado: $nome (porta $porta)."
}

parar_porta "$PORTA_FRONT" "Front-end"
parar_porta "$PORTA_API" "API"

# Docker: se o DOCKER_HOST atual não responder (ex.: apontando para o Podman), usa o socket padrão.
if ! docker info > /dev/null 2>&1 && [ -S /var/run/docker.sock ]; then
    export DOCKER_HOST=unix:///var/run/docker.sock
fi
if docker compose -f "$RAIZ/.devcontainer/docker-compose.yml" stop db > /dev/null 2>&1; then
    echo "⏹  Banco (MySQL) parado. Os dados continuam salvos."
else
    echo "• Banco (MySQL): não foi possível parar pelo Docker (ele está instalado e rodando?)."
fi
