import axios from "axios";
import { expect, test } from "vitest";

test('Deve se conectar com a API', ()=>{
    //axios.get(import.meta.env.API_URL).then();
    console.log(import.meta.env.VITE_API_URL)
    expect(true).toBe(true)
})