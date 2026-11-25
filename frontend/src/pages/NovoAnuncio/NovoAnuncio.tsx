import FormAnuncio from "../../components/FormAnuncio/FormAnuncio";
import { fontes, cores } from "../../lib/pallete";
import styles from "./NovoAnuncio.module.css";

export default function NovoAnuncio(){
    return <div className={styles.divPrincipal} style={{backgroundColor: cores.bg}}>
        <h1 style={{color: cores.dark}}>NovoAnucnio</h1>
        <FormAnuncio/>
    </div>
}