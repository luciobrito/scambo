import { pallete } from "../../pallete";

export function IconeLocal() {
    return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={pallete.sageGreen} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
    );
}

export function IconeBusca({ cor = pallete.dark, tamanho = 17 }: { cor?: string, tamanho?: number }) {
    return (
        <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
    );
}

export function IconeSino() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={pallete.dark} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}

export function IconeImagem() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={pallete.palmLeaf} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.5-3.5L8 21" />
        </svg>
    );
}
