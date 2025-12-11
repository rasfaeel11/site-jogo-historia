import { Personagem } from "./Personagem";

export class Sombrilico extends Personagem {
    constructor(nome: string) {
        super(nome); // Passa só o nome para o Pai
        
        // Define os atributos específicos do Mago
        this.hp = 100;
        this.hpMax = 100;
        this.mana = 100;
        this.manaMax = 100;
        this.forca = 10;
        this.defesa = 10;
        this.inteligencia = 18; // Magos são espertos
        this.velocidade = 9;
        this.qtdPot = 3;
        this.classe = "Sombrílico"
    }
}