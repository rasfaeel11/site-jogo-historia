import { Personagem } from "./Personagem";

export class ENTROPISTA extends Personagem {
    constructor(nome: string) {
        super(nome); // Passa só o nome para o Pai
        
        // Define os atributos específicos do Guerreiro
        this.hp = 110;
        this.hpMax = 110;
        this.mana = 120;
        this.manaMax = 120;
        this.forca = 5;
        this.defesa = 8;
        this.inteligencia = 20;
        this.velocidade = 5;
        this.qtdPot = 3;
        this.classe = "ENTROPISTA";
    }
}