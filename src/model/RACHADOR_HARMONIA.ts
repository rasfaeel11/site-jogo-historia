import { Personagem } from "./Personagem";

export class RACHADOR_HARMONIA extends Personagem {
    constructor(nome: string) {
        super(nome); // Passa só o nome para o Pai
        
        // Define os atributos específicos do Mago
        this.hp = 90;
        this.hpMax = 90;
        this.mana = 60;
        this.manaMax = 60;
        this.forca = 22;
        this.defesa = 6;
        this.inteligencia = 8; // Magos são espertos
        this.velocidade = 10;
        this.qtdPot = 3;
        this.classe = "RACHADOR_HARMONIA"
    }
}