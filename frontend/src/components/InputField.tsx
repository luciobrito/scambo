import { cores, fontes } from "../lib/paleta";

export function InputField({
  label, type = "text", placeholder, value, onChange, icon,
}: {
  label: string; type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontFamily: fontes.sans, fontSize: 11, fontWeight: 700, color: cores.palmLeaf, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            fontFamily: fontes.sans,
            fontSize: 14,
            color: cores.dark,
            background: cores.card,
            border: `1.5px solid ${cores.drySage}`,
            borderRadius: "1rem",
            padding: icon ? "13px 16px 13px 42px" : "13px 16px",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={(e) => { e.target.style.borderColor = cores.sageGreen; e.target.style.boxShadow = `0 0 0 3px rgba(108,174,117,0.15)`; }}
          onBlur={(e) => { e.target.style.borderColor = cores.drySage; e.target.style.boxShadow = "none"; }}
        />
      </div>
    </div>
  );
}
