import { Personagem } from "./Personagem";

export class Mistico_da_Entalma extends Personagem {
    constructor(nome: string) {
        super(nome); // Passa só o nome para o Pai
        
        // Define os atributos específicos do Mago
        this.hp = 110;
        this.hpMax = 110;
        this.mana = 110;
        this.manaMax = 110;
        this.forca = 8;
        this.defesa = 16;
        this.inteligencia = 16; // Magos são espertos
        this.velocidade = 4;
        this.qtdPot = 3;
        this.classe = "Místico da Entalma"
    }
}