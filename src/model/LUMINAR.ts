import { Personagem } from "./Personagem";

export class LUMINAR extends Personagem {
    constructor(nome: string) {
        super(nome); // Passa só o nome para o Pai
        
        // Define os atributos específicos do Guerreiro
        this.hp = 160;
        this.hpMax = 160;
        this.mana = 60;
        this.manaMax = 60;
        this.forca = 12;
        this.defesa = 18;
        this.inteligencia = 12;
        this.velocidade = 3;
        this.qtdPot = 3;
        this.classe = "LUMINAR";
    }
}