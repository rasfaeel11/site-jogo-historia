export abstract class Personagem {
    // Propriedades Públicas (O Banco de dados e o GameLoop podem ler e escrever nelas)
    public nome: string;
    
    public hp: number;
    public hpMax: number;
    
    public mana: number;
    public manaMax: number;
    
    public forca: number;
    public defesa: number;     // Adicionamos a defesa que faltava
    public inteligencia: number; // Adicionei inteligência já que você tinha no seu
    
    public velocidade: number; 
    public qtdPot: number;

    // Construtor Simplificado: Pede apenas o NOME.
    // Os status (hp, força, etc) serão definidos pelas classes filhas (Guerreiro/Mago).
    constructor(nome: string) {
        this.nome = nome;
        
        // Valores "Dummy" iniciais (serão sobrescritos imediatamente pelo Guerreiro/Mago)
        this.hp = 100;
        this.hpMax = 100;
        this.mana = 50;
        this.manaMax = 50;
        this.forca = 10;
        this.defesa = 10;
        this.inteligencia = 10;
        this.velocidade = 5;
        this.qtdPot = 3; 
    }
}