import "./Login.css";
export default function Login(){
    return <>
    
    <h1>Escambo</h1>
    <div className="div-custom">
        <div className="caixa-login">
        
            <form className="form-custom">
                <div>
                    <label htmlFor="labelLogin">Login: </label>
                    <input type="text" name="Nome" id="inputNome"/>
                </div>
                <br />
                <div>
                    <label htmlFor="labelSenha">Senha: </label>
                    <input type="password" name="Senha" id="inputSenha" />
                </div>
            </form>
            <br />
            <section className="section-custom">
                <button>Login</button>
                <br />
                <text>Não tem conta? <a href="/">Crie uma aqui!</a></text>
                <br />
            </section>
        </div>  
        <text ><a href="/" >Termos de Uso</a></text>
    </div>
    </>
}   