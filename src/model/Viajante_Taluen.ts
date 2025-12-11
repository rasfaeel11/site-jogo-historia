import { Personagem } from "./Personagem";

export class VIAJANTE_TALUEN extends Personagem {
    constructor(nome: string) {
        super(nome); // Passa só o nome para o Pai
        
        // Define os atributos específicos do Mago
        this.hp = 90;
        this.hpMax = 90;
        this.mana = 80;
        this.manaMax = 80;
        this.forca = 14;
        this.defesa = 8;
        this.inteligencia = 14; // Magos são espertos
        this.velocidade = 20;
        this.qtdPot = 3;
        this.classe = "Viajante Talúen"
    }
}