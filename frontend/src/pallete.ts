import type { CSSProperties } from "react";

export const pallete = {
  palmLeaf: "#8b9474",
  sageGreen: "#6cae75",
  mutedOlive: "#8bbd8b",
  drySage: "#c1cc99",
  sandyBrown: "#f5a65b",
  bg: "#f5f7ee",
  card: "#ffffff",
  dark: "#2e3322",
  shell: "#dde3cc",
};

export const font = {
  serif: "'Fraunces', serif",
  sans: "'Outfit', sans-serif",
};

// Expõe a paleta como variáveis CSS para os módulos de estilos.
export const variaveisPaleta = {
  "--palm-leaf": pallete.palmLeaf,
  "--sage-green": pallete.sageGreen,
  "--muted-olive": pallete.mutedOlive,
  "--dry-sage": pallete.drySage,
  "--sandy-brown": pallete.sandyBrown,
  "--bg": pallete.bg,
  "--card": pallete.card,
  "--dark": pallete.dark,
  "--serif": font.serif,
  "--sans": font.sans,
} as CSSProperties;
