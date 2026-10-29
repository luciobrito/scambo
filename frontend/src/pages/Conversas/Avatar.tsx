import { pallete } from "../../pallete";
import styles from "./Conversas.module.css";

const CORES = [pallete.sageGreen, pallete.sandyBrown, pallete.palmLeaf, pallete.mutedOlive];

interface AvatarProps {
    id: number,
    nome: string,
    online: boolean,
    pequeno?: boolean
}

// Cor fixa por contato, para a mesma pessoa ter sempre a mesma cor.
export default function Avatar({ id, nome, online, pequeno }: AvatarProps) {
    return (
        <div className={styles.avatarWrapper}>
            <div className={`${styles.avatar} ${pequeno ? styles.avatarPequeno : ""}`} aria-hidden="true"
                style={{ background: CORES[id % CORES.length] }}>
                {nome[0].toUpperCase()}
            </div>
            {online && <span className={styles.online} role="img" aria-label="online" />}
        </div>
    );
}
