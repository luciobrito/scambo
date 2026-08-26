interface ComponenteProps{
    nome : string
}

function Componente({nome} : ComponenteProps){
    return (
        <div>
            <h1>Olá {nome}!</h1>
        </div>
    );
}

export default Componente