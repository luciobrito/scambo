import { expect, test } from "vitest";

function sum(a : number,b : number){
    return a +b;
}

test('adicionar 1 + 1', ()=> {
    expect(sum(1,1)).toBe(2);
})