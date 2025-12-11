import { Personagem } from "./Personagem";

export class Forjardente extends Personagem {
    constructor(nome: string) {
        super(nome); // Passa só o nome para o Pai
        
        // Define os atributos específicos do Mago
        this.hp = 120;
        this.hpMax = 120;
        this.mana = 70;
        this.manaMax = 70;
        this.forca = 16;
        this.defesa = 12;
        this.inteligencia = 14; // Magos são espertos
        this.velocidade = 6;
        this.qtdPot = 3;
        this.classe = "Forjardente";
}}