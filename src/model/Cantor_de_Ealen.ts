import { Personagem } from "./Personagem";

export class CANTOR_DE_EALEN extends Personagem {
    constructor(nome: string) {
        super(nome); // Passa só o nome para o Pai
        
        // Define os atributos específicos do Mago
        this.hp = 90;
        this.hpMax = 90;
        this.mana = 140;
        this.manaMax = 140;
        this.forca = 4;
        this.defesa = 6;
        this.inteligencia = 20; // Magos são espertos
        this.velocidade = 8;
        this.qtdPot = 3;
        this.classe = "CANTOR_DE_EALEN"
    }
}