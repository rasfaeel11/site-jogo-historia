import { Personagem } from "./Personagem";

export class Guerreiro extends Personagem {
    constructor(nome: string){
        const classeGuerreiro = "Guerreiro";
        const hpGuerreiro = 50;
        const manaGuerreiro = 10;
        const forcaGuerreiro = 7;
        const qtdPot = 3;
        const _inteligenciaGuerreiro = 2;
        const _manaMax = 10;

        super(
            nome, 
            classeGuerreiro,
            hpGuerreiro,
            hpGuerreiro,
            manaGuerreiro,
            forcaGuerreiro,
            qtdPot,
            _inteligenciaGuerreiro,
            _manaMax
        );
    }
}