import axios from "axios";
import { useEffect, useState } from "react";
import { listarAnuncios, type Produto } from "../services/anuncios";

type EstadoProdutos =
    | { status: 'carregando' }
    | { status: 'sucesso', produtos: Produto[] }
    | { status: 'erro', mensagem: string };

export default function useProdutos() {
    const [estado, setEstado] = useState<EstadoProdutos>({ status: 'carregando' });
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        listarAnuncios(controller.signal)
            .then(produtos => setEstado({ status: 'sucesso', produtos }))
            .catch(erro => {
                if (axios.isCancel(erro)) return;
                setEstado({ status: 'erro', mensagem: "Não foi possível carregar os itens. Verifique sua conexão e tente novamente." });
            });
        return () => controller.abort();
    }, [tentativa]);

    function recarregar() {
        setEstado({ status: 'carregando' });
        setTentativa(t => t + 1);
    }

    return { estado, recarregar };
}
