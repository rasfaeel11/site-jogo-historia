import { Personagem } from "./Personagem";

export class Mago extends Personagem {
    constructor(nome: string) {
        super(nome); // Passa só o nome para o Pai
        
        // Define os atributos específicos do Mago
        this.hp = 80;
        this.hpMax = 80;
        this.mana = 100;
        this.manaMax = 100;
        this.forca = 5;
        this.defesa = 6;
        this.inteligencia = 20; // Magos são espertos
        this.velocidade = 6;
        this.qtdPot = 3;
    }
}