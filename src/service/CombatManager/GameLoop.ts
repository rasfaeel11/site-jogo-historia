import { atacar, ataqueMagico, curar, rolarDadodd20, executarHabilidadeEspecial } from "../CombatService";
import { Personagem } from "../../model/Personagem";
import { AcaoCombate, ClassesJogo } from "../../model/GameTypes";

// IMPORTS DAS CLASSES
import { LUMINAR } from "../../model/LUMINAR";
import { RACHADOR_HARMONIA } from "../../model/RACHADOR_HARMONIA";
import { CANTOR_DE_EALEN } from "../../model/Cantor_de_Ealen";
import { ENTROPISTA } from "../../model/Entropista";
import { Forjardente } from "../../model/Forjardente";
import { Guardiao_da_Singularidade } from "../../model/Guardiao_da_Singularidade";
import { Sombrilico } from "../../model/Sombrilico";
import { VIAJANTE_TALUEN } from "../../model/Viajante_Taluen";
import { Lunath_Ancestral } from "../../model/Lunath_Ancestral";
import { Mistico_da_Entalma } from "../../model/Mistico_da_Entalma";


const MAPA_DE_CLASSES: Record<string, any> = {
    "LUMINAR": LUMINAR,
    "RACHADOR_HARMONIA": RACHADOR_HARMONIA,
    "CANTOR_DE_EALEN": CANTOR_DE_EALEN,
    "ENTROPISTA": ENTROPISTA,
    "FORJARDENTE": Forjardente,
    "GUARDIAO_SINGULARIDADE": Guardiao_da_Singularidade,
    "SOMBRILICO": Sombrilico,
    "VIAJANTE_TALUEN": VIAJANTE_TALUEN,
    "LUNATH_ANCESTRAL": Lunath_Ancestral,
    "MISTICO_ENTALMA": Mistico_da_Entalma
};

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


    public iniciarJogo(nome: string, escolhaClasse: ClassesJogo): Personagem {
        

        const ClasseHeroi = MAPA_DE_CLASSES[escolhaClasse];
        if (!ClasseHeroi) throw new Error("Classe de herói inválida!");
        
        this.principal = new ClasseHeroi(nome);
  
        this.principal.classe = escolhaClasse; 



        const chavesClasses = Object.keys(MAPA_DE_CLASSES); 
        const nomeAleatorio = chavesClasses[Math.floor(Math.random() * chavesClasses.length)];
        const ClasseInimigo = MAPA_DE_CLASSES[nomeAleatorio];

        this.alvo = new ClasseInimigo("Inimigo " + nomeAleatorio); 
        this.alvo.classe = nomeAleatorio; 

        return this.principal;
    }

    // -----------------------------------------------------
    // 2. CARREGAR ESTADO (A Reidratação Inteligente)
    // -----------------------------------------------------
    public carregarEstado(dadosHeroi: any, dadosInimigo: any) {
        
     
        const ClasseHeroi = MAPA_DE_CLASSES[dadosHeroi.classe];
        
        if (ClasseHeroi) {
            this.principal = new ClasseHeroi(dadosHeroi.nome);
        } else {
            // Fallback: Se der erro, cria um genérico para não travar
            console.error("Classe não encontrada no save:", dadosHeroi.classe);
            this.principal = new LUMINAR(dadosHeroi.nome); 
        }

      
        const p: any = this.principal;
        p.hp = dadosHeroi.hp;
        p.hpMax = dadosHeroi.hpMax; 
        p.mana = dadosHeroi.mana;
        p.manaMax = dadosHeroi.manaMax;
        p.forca = dadosHeroi.forca;
        p.defesa = dadosHeroi.defesa;
        p.inteligencia = dadosHeroi.inteligencia;
        p.velocidade = dadosHeroi.velocidade;
        p.classe = dadosHeroi.classe; // Garante que a classe persista

        

        const ClasseInimigo = MAPA_DE_CLASSES[dadosInimigo.classe];

        if (ClasseInimigo) {
            this.alvo = new ClasseInimigo(dadosInimigo.nome);
        } else {
            this.alvo = new Sombrilico(dadosInimigo.nome);
        }

        const i: any = this.alvo;
        i.hp = dadosInimigo.hp;
        i.hpMax = dadosInimigo.hpMax;
        i.mana = dadosInimigo.mana;
        i.manaMax = dadosInimigo.manaMax;
        i.forca = dadosInimigo.forca;
        i.defesa = dadosInimigo.defesa;
        i.inteligencia = dadosInimigo.inteligencia;
        i.velocidade = dadosInimigo.velocidade;
        i.classe = dadosInimigo.classe;
    }


    public processarTurno(acao: AcaoCombate): ResultadoTurno {
        if (!this.principal || !this.alvo) {
            throw new Error("O jogo não foi carregado corretamente.");
        }

        this.logs = [];


        const iniciativaHeroi = this.principal.velocidade + rolarDadodd20();
        const iniciativaInimigo = this.alvo.velocidade + rolarDadodd20();
        
        const heroiComeca = iniciativaHeroi >= iniciativaInimigo;

        if (heroiComeca) {
            this.turnoJogador(acao);
            if (this.alvo.hp > 0) this.turnoInimigo();
        } else {
            this.log(`⚡ O ${this.alvo.nome} foi mais rápido e agiu primeiro!`);
            this.turnoInimigo();
            if (this.principal.hp > 0) this.turnoJogador(acao);
        }

        // Verifica Mortes
        if (this.alvo.hp <= 0) {
            this.log(`🎉 O inimigo ${this.alvo.nome} foi derrotado!`);
            return { jogoContinua: false, logs: this.logs };
        }
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
                    this.log("⚠️ Mana insuficiente! Turno perdido.");
                } else {
                    const dano = ataqueMagico(this.principal, this.alvo);
                    this.log(`✨ Magia lançada! Causou ${dano} de dano.`);
                }
                break;
            }
            case "CURAR": {
                if (this.principal.qtdPot > 0) {
                    const valorCura = curar(this.principal);
                    this.log(`🧪 Você recuperou ${valorCura} de HP.`);
                } else {
                    this.log("🎒 Sem poções!");
                }
                break;
            }
            case "HABILIDADE_ESPECIAL": {
                const msg = executarHabilidadeEspecial(this.principal, this.alvo);
                this.log(msg);
                break;
            }
            case "FUGIR": {
                this.log("🏃 Tentou fugir e falhou.");
                break;
            }
        }
    }

    private turnoInimigo() {
        // IA Simples:
        // 30% chance de ultar se tiver mana
        // 50% chance de atacar
        // 20% chance de curar se vida baixa

        const acao = Math.random();
        
        if (this.alvo.hp < this.alvo.hpMax * 0.3 && this.alvo.qtdPot > 0 && acao < 0.3) {
            const cura = curar(this.alvo);
            this.log(`❤️ Inimigo se curou em ${cura}.`);
            return;
        }

        if (this.alvo.mana > 20 && acao > 0.7) {
             const msg = executarHabilidadeEspecial(this.alvo, this.principal);
             this.log(`⚠️ PERIGO: ${msg}`);
             return;
        }

        const dano = atacar(this.alvo, this.principal);
        this.log(`⚔️ Inimigo atacou causando ${dano} de dano.`);
    }
}