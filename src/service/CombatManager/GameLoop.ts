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

    // -------------------------------------
    //             INICIAR JOGO
    // -------------------------------------
    public iniciarJogo(nome: string, escolhaClasse: ClassesJogo): Personagem {
        switch (escolhaClasse) {
            case "GUERREIRO":
                this.principal = new Guerreiro(nome);
                this.alvo = new Mago("Merlin");
                break;

            case "MAGO":
                this.principal = new Mago(nome);
                this.alvo = new Guerreiro("Arthur");
                break;

            default:
                throw new Error("Classe inválida.");
        }

        return this.principal;
    }

    public getPrincipal(): Personagem {
        return this.principal;
    }

    public getAlvo(): Personagem {
        return this.alvo;
    }

    // -------------------------------------
    //             PROCESSAR TURNO
    // -------------------------------------
    public processarTurno(acao: AcaoCombate): ResultadoTurno {
        if (!this.principal || !this.alvo) {
            throw new Error("O jogo ainda não foi iniciado.");
        }

        this.logs = [];

        const d20PrimeiroTurnoJogador = rolarDadodd20() + this.principal.velocidade;
        const d20PrimeiroTurnoMaquina = rolarDadodd20() + this.alvo.velocidade;


        this.turnoJogador(acao);


        if (this.alvo.hp <= 0) {
            this.log("🎉 Você venceu o combate!");
            return { jogoContinua: false, logs: this.logs };
        }


        this.turnoInimigo();

        if (this.principal.hp <= 0) {
            this.log("💀 Você foi derrotado...");
            return { jogoContinua: false, logs: this.logs };
        }

        return { jogoContinua: true, logs: this.logs };
    }


    private turnoJogador(acao: AcaoCombate) {
        switch (acao) {
            case "ATACAR": {
                const dano = atacar(this.principal, this.alvo);
                this.log(`🗡️ Você atacou e causou ${dano} de dano.`);
                break;
            }

            case "MAGIA": {
                const dano = ataqueMagico(this.principal, this.alvo);
                this.log(`✨ Você usou magia e causou ${dano} de dano.`);
                break;
            }

            case "CURAR": {
                const valorCura = curar(this.principal);
                this.log(`🧪 Você usou uma poção e recuperou ${valorCura} de HP.`);
                break;
            }

            default:
                this.log("Você se atrapalhou e perdeu a ação! (ação inválida)");
        }
    }

    private turnoInimigo() {
        const chance = Math.random();


        const vidaBaixa = this.alvo.hp <= this.alvo.hpMax * 0.15;

        if (vidaBaixa && this.alvo.qtdPot > 0 && chance < 0.3) {
            const curaValor = curar(this.alvo);
            this.log(`🧪 O inimigo usou uma poção e curou ${curaValor} de HP.`);
            return;
        }


        if (this.alvo.mana >= 5 && chance < 0.7) {
            const danoMagia = ataqueMagico(this.alvo, this.principal);
            this.log(`✨ O inimigo lançou magia e causou ${danoMagia} de dano!`);
            return;
        }

        const danoFisico = atacar(this.alvo, this.principal);
        this.log(`🗡️ O inimigo te atacou fisicamente causando ${danoFisico} de dano.`);
    }
}
