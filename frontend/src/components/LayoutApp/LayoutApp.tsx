import { Outlet } from "react-router";
import Sidebar from "../Sidebar/Sidebar";
import { variaveisPaleta } from "../../pallete";
import styles from "./LayoutApp.module.css";

export default function LayoutApp() {
    return (
        <div className={styles.layout} style={variaveisPaleta}>
            <Sidebar />
            <div className={styles.conteudo}>
                <Outlet />
            </div>
        </div>
    );
}
