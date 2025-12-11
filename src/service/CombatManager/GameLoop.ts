import { atacar, ataqueMagico, curar, rolarDadodd20 } from "../CombatService";
// Ajuste os imports abaixo conforme o caminho das suas pastas
import { Personagem } from "../../model/Personagem";
import {  LUMINAR } from "../../model/LUMINAR";
import { RACHADOR_HARMONIA } from "../../model/RACHADOR_HARMONIA";
import { AcaoCombate, ClassesJogo } from "../../model/GameTypes";
import { CANTOR_DE_EALEN } from "../../model/Cantor_de_Ealen";
import { ENTROPISTA } from "../../model/Entropista";
import { Forjardente } from "../../model/Forjardente";
import { Guardiao_da_Singularidade } from "../../model/Guardiao_da_Singularidade";
import { Sombrilico } from "../../model/Sombrilico";
import { VIAJANTE_TALUEN } from "../../model/Viajante_Taluen";
import { Lunath_Ancestral } from "../../model/Lunath_Ancestral";
import { Mistico_da_Entalma } from "../../model/Mistico_da_Entalma";

interface ResultadoTurno {
    jogoContinua: boolean;
    logs: string[];
}

export class GameLoop {
    public principal!: Personagem;
    public alvo!: Personagem;
    private logs: string[] = [];

    private log(msg: string) {
        this.logs.push(msg);
    }

    // 1. INICIAR (Cria do zero)
    public iniciarJogo(nome: string, escolhaClasse: ClassesJogo): Personagem {
        switch (escolhaClasse) {
            case "LUMINAR":
                this.principal = new LUMINAR(nome); // Usando a classe genérica atualizada
                break;
            case "RACHADOR_HARMONIA":
                this.principal = new RACHADOR_HARMONIA(nome);
                break;
            case "CANTOR_DE_EALEN":
                this.principal = new CANTOR_DE_EALEN(nome);
                break;
            case "ENTROPISTA":
                this.principal = new ENTROPISTA(nome);
                break;
            case "FORJARDENTE":
                this.principal = new Forjardente(nome);
                break;
            case "GUARDIAO_SINGULARIDADE":
                this.principal = new Guardiao_da_Singularidade(nome);
                break;
            case "SOMBRILICO":
                this.principal = new Sombrilico(nome);
                break;
            case "VIAJANTE_TALUEN":
                this.principal = new VIAJANTE_TALUEN(nome);
                break;
            case "LUNATH_ANCESTRAL":
                this.principal = new Lunath_Ancestral(nome);
                break;
            case "MISTICO_ENTALMA":
                this.principal = new Mistico_da_Entalma(nome);
                break;
            
            default:
                throw new Error("Classe inválida.");
        }

        return this.principal;
    }

    // 2. CARREGAR (Reidrata do Banco) - AQUI ESTÁ A CORREÇÃO DO UNDEFINED
    public carregarEstado(dadosHeroi: any, dadosInimigo: any) {
        
        // --- Recriando o HEROI ---
        if (dadosHeroi.manaMax > 20) {
            this.principal = new Mago(dadosHeroi.nome);
        } else {
            this.principal = new Guerreiro(dadosHeroi.nome);
        }

        // TRUQUE: Transformamos em 'any' para o TypeScript permitir 
        // escrever em variáveis 'readonly' ou 'protected'
        const p: any = this.principal; 

        p.hp = dadosHeroi.hp; 
        p.mana = dadosHeroi.mana;
        p.forca = dadosHeroi.forca;
        p.hpMax = dadosHeroi.hpMax; // Corrigido de vidaMax para hpMax
        p.manaMax = dadosHeroi.manaMax;


        // --- Recriando o INIMIGO ---
        if (dadosInimigo.manaMax > 20) {
            this.alvo = new Mago(dadosInimigo.nome);
        } else {
            this.alvo = new Guerreiro(dadosInimigo.nome);
        }
        
        const i: any = this.alvo; // Mesma coisa pro inimigo

        i.hp = dadosInimigo.hp;
        i.mana = dadosInimigo.mana;
        i.forca = dadosInimigo.forca;
        i.hpMax = dadosInimigo.hpMax;
        i.manaMax = dadosInimigo.manaMax;
    }

    // 3. PROCESSAR TURNO
    public processarTurno(acao: AcaoCombate): ResultadoTurno {
        if (!this.principal || !this.alvo) {
            throw new Error("O jogo não foi carregado corretamente.");
        }

        this.logs = [];

        // Turno do Jogador
        this.turnoJogador(acao);

        // Verifica vitória
        if (this.alvo.hp <= 0) {
            this.log(`🎉 O inimigo ${this.alvo.nome} foi derrotado!`);
            return { jogoContinua: false, logs: this.logs };
        }

        // Turno do Inimigo
        this.turnoInimigo();

        // Verifica derrota
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
                this.log("🏃 Você tentou fugir, mas tropeçou! (Fuga não implementada)");
                break;
            }
            default:
                this.log("❓ Ação desconhecida. Você hesitou.");
        }
    }

    private turnoInimigo() {
        const chance = Math.random();
        // IA básica
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