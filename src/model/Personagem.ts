export abstract class Personagem {
    public nome: string;
    
    public hp: number;
    public hpMax: number;
    
    public mana: number;
    public manaMax: number;
    
    public forca: number;
    public defesa: number;     
    public inteligencia: number; 
    
    public velocidade: number; 
    public qtdPot: number;
    public classe: string;

  

    constructor(nome: string) {
        this.nome = nome;
        
        this.hp = 100;
        this.hpMax = 100;
        this.mana = 50;
        this.manaMax = 50;
        this.forca = 10;
        this.defesa = 10;
        this.inteligencia = 10;
        this.velocidade = 5;
        this.qtdPot = 3; 
        this.classe = "Generico";
    }
}