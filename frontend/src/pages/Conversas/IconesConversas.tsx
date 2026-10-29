import { pallete } from "../../pallete";

export function IconeVoltar() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={pallete.dark} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
    );
}

export function IconeOpcoesHorizontal() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={pallete.dark} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
        </svg>
    );
}

export function IconeImagem() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={pallete.palmLeaf} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

export function IconeEnviar() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
    );
}

export function IconeNovaConversa() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={pallete.dark} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    );
}

export function IconeBusca() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={pallete.palmLeaf} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
    );
}
