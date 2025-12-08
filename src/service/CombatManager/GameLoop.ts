import { atacar, ataqueMagico, curar, rolarDadodd20 } from "../CombatService";
import { Personagem } from "../../model/Personagem";
import { Guerreiro } from "../../model/Guerreiro";
import { Mago } from "../../model/Mago";
import { AcaoCombate, ClassesJogo } from "../../model/GameTypes";

interface ResultadoTurno {
    jogoContinua: boolean;
    logs: string[];
}

export class GameLoop {
    private principal!: Personagem;
    private alvo!: Personagem;
    private logs: string[] = [];


    private log(msg: string) {
        this.logs.push(msg);
    }

    public iniciarJogo(nome: string, escolhaClasse: ClassesJogo): Personagem {
        switch (escolhaClasse) {
            case "GUERREIRO":
                this.principal = new Guerreiro(nome);
    
                this.alvo = new Mago("Mago Maligno"); 
                break;

            case "MAGO":
                this.principal = new Mago(nome);
                this.alvo = new Guerreiro("Cavaleiro Negro");
                break;

            default:
                throw new Error("Classe inválida.");
        }

        return this.principal;
    }


    public carregarEstado(dadosHeroi: any, dadosInimigo: any) {
       
        if (dadosHeroi.manaMax > 20) {
            this.principal = new Mago(dadosHeroi.nome);
        } else {
            this.principal = new Guerreiro(dadosHeroi.nome);
        }


        Object.assign(this.principal, dadosHeroi);



        if (dadosInimigo.manaMax > 20) {
            this.alvo = new Mago(dadosInimigo.nome);
        } else {
            this.alvo = new Guerreiro(dadosInimigo.nome);
        }
        

        Object.assign(this.alvo, dadosInimigo);
    }


    public getPrincipal(): Personagem {
        return this.principal;
    }

    public getAlvo(): Personagem {
        return this.alvo;
    }


    public processarTurno(acao: AcaoCombate): ResultadoTurno {
        if (!this.principal || !this.alvo) {
            throw new Error("O jogo não foi carregado corretamente.");
        }


        this.logs = [];

        this.turnoJogador(acao);


        if (this.alvo.hp <= 0) {
            this.log(`🎉 O inimigo ${this.alvo.nome} foi derrotado!`);
            return { jogoContinua: false, logs: this.logs };
        }


        this.turnoInimigo();

        if (this.principal.hp <= 0) {
            this.log(`💀 Você morreu... Game Over.`);
            return { jogoContinua: false, logs: this.logs };
        }

        return { jogoContinua: true, logs: this.logs };
    }


    private turnoJogador(acao: AcaoCombate) {
        switch (acao) {
            case "ATACAR": {
                const dano = atacar(this.principal, this.alvo);
                this.log(`🗡️ Você atacou ${this.alvo.nome} e causou ${dano} de dano.`);
                break;
            }
            case "MAGIA": {

                if (this.principal.mana < 5) {
                    this.log("⚠️ Mana insuficiente! Você perdeu o turno tentando conjurar.");
                } else {
                    const dano = ataqueMagico(this.principal, this.alvo);
                    this.log(`✨ Você lançou magia em ${this.alvo.nome} causando ${dano} de dano.`);
                }
                break;
            }
            case "CURAR": {
                if (this.principal.qtdPot > 0) {
                    const valorCura = curar(this.principal);
                    this.log(`🧪 Você bebeu uma poção e recuperou ${valorCura} de HP.`);
                } else {
                    this.log("🎒 Sem poções! Você perdeu o turno procurando na mochila.");
                }
                break;
            }
            case "FUGIR": {
                //(nao implementada)
                this.log("🏃 Você tentou fugir, mas tropeçou! (Fuga não implementada)");
                break;
            }
            default:
                this.log("❓ Ação desconhecida. Você hesitou.");
        }
    }

    // Lógica privada da IA do Inimigo
    private turnoInimigo() {
        const chance = Math.random();
        const vidaBaixa = this.alvo.hp <= (this.alvo.hpMax * 0.3); 

        if (vidaBaixa && this.alvo.qtdPot > 0 && chance < 0.3) {
            const curaValor = curar(this.alvo);
            this.log(`❤️ O inimigo usou uma poção e recuperou ${curaValor} de vida.`);
            return;
        }


        if (this.alvo.mana >= 5 && chance > 0.5) {
            const danoMagia = ataqueMagico(this.alvo, this.principal);
            this.log(`🔥 O inimigo lançou uma bola de fogo! Dano: ${danoMagia}.`);
            return;
        }


        const danoFisico = atacar(this.alvo, this.principal);
        this.log(`⚔️ O inimigo te atacou! Você sofreu ${danoFisico} de dano.`);
    }
}