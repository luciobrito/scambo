import { cores, fontes } from "../lib/pallete";

export function ScamboLogo({ size = 32, color = cores.sageGreen }: { size?: number; color?: string }) {
  return (
    <span style={{ fontFamily: fontes.serif, fontStyle: "italic", fontWeight: 800, color, fontSize: size, letterSpacing: "-1.5px", lineHeight: 1 }}>
      Scambo
    </span>
  );
}
