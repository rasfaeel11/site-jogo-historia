import { Personagem } from "./Personagem";

export class Lunath_Ancestral extends Personagem {
    constructor(nome: string) {
        super(nome); // Passa só o nome para o Pai
        
        // Define os atributos específicos do Mago
        this.hp = 100;
        this.hpMax = 100;
        this.mana = 130;
        this.manaMax = 130;
        this.forca = 6;
        this.defesa = 10;
        this.inteligencia = 16; // Magos são espertos
        this.velocidade = 5;
        this.qtdPot = 3;
        this.classe = "Lunath Ancestral"
    }
}