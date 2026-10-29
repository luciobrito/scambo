import { useEffect, useState } from "react";

type EstadoDados<T> =
    | { status: 'carregando' }
    | { status: 'sucesso', dados: T }
    | { status: 'erro' };

// `carregar` deve ser uma referência estável (ex.: função de um serviço).
export default function useCarregarDados<T>(carregar: () => Promise<T>) {
    const [estado, setEstado] = useState<EstadoDados<T>>({ status: 'carregando' });
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        let ativo = true;
        carregar()
            .then(dados => { if (ativo) setEstado({ status: 'sucesso', dados }); })
            .catch(() => { if (ativo) setEstado({ status: 'erro' }); });
        return () => { ativo = false; };
    }, [carregar, tentativa]);

    function recarregar() {
        setEstado({ status: 'carregando' });
        setTentativa(t => t + 1);
    }

    return { estado, recarregar };
}
