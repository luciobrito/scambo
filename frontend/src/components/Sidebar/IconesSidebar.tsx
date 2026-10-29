const propsSvg = {
    width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true
} as const;

export function IconeInicio() {
    return (
        <svg {...propsSvg}>
            <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
        </svg>
    );
}

export function IconeChat() {
    return (
        <svg {...propsSvg}>
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
        </svg>
    );
}

export function IconePerfil() {
    return (
        <svg {...propsSvg}>
            <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
    );
}

// Porta com seta saindo: representa deslogar.
export function IconeSair() {
    return (
        <svg {...propsSvg} width={18} height={18}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}
