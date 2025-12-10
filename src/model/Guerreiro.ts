import { Personagem } from "./Personagem";

export class Guerreiro extends Personagem {
    constructor(nome: string) {
        super(nome); // Passa só o nome para o Pai
        
        // Define os atributos específicos do Guerreiro
        this.hp = 150;
        this.hpMax = 150;
        this.mana = 20;
        this.manaMax = 20;
        this.forca = 15;
        this.defesa = 12;
        this.inteligencia = 5;
        this.velocidade = 4;
        this.qtdPot = 3;
    }
}