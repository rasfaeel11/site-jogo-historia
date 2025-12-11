import { Personagem } from "./Personagem";

export class Guardiao_da_Singularidade extends Personagem {
    constructor(nome: string) {
        super(nome); // Passa só o nome para o Pai
        
        // Define os atributos específicos do Mago
        this.hp = 140;
        this.hpMax = 140;
        this.mana = 50;
        this.manaMax = 50;
        this.forca = 18;
        this.defesa = 14;
        this.inteligencia = 6; // Magos são espertos
        this.velocidade = 4;
        this.qtdPot = 3;
        this.classe = "Guardião da Singularidade"
    }
}