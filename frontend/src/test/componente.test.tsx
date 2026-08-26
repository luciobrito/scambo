import { describe, expect, it } from "vitest";
import { render, screen } from '@testing-library/react';
import  Componente  from "../Componente";
import '@testing-library/jest-dom';
describe('Componente', () =>{
    it('Deve ter um titulo com olá mundo', ()=>{
        const valor = "mundo";
        render(<Componente nome={valor}/>);
        var heading = screen.getByRole('heading', {level: 1});
        expect(heading).toHaveTextContent(`Olá ${valor}!`);
    })
})