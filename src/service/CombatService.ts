import { Personagem } from "../model/Personagem";
import { ClassesJogo } from "../model/GameTypes";

const CRITICO = 20;
const FALHA = 1;

export function rolarDadodd20(): number {
    return Math.floor(Math.random() * 20) + 1;
}

function logicaDanoFisico(personagem: Personagem): number {
    const d20 = rolarDadodd20();

    if (d20 === FALHA) return 0;

    let danoTotal = d20 + personagem.forca;

    if (d20 === CRITICO) {
        danoTotal *= 2;
    }

    return danoTotal;
}

function logicaDanoMagico(personagem: Personagem): number {
    const gastoManaAtaque = 5;

    if (personagem.mana < gastoManaAtaque) return 0;

    const d20 = rolarDadodd20();

    if (d20 === FALHA) return 0;

    personagem.mana -= gastoManaAtaque;

    let danoTotal = d20 + personagem.inteligencia;

    if (d20 === CRITICO) {
        danoTotal *= 2;
    }

    return danoTotal;
}

export function atacar(atacante: Personagem, alvo: Personagem): number {
    const danoBruto = logicaDanoFisico(atacante);

    if (danoBruto === 0) return 0;

    const danoLiquido = Math.max(0, danoBruto - alvo.defesa);

    alvo.hp = Math.max(0, alvo.hp - danoLiquido);

    return danoLiquido;
}

export function ataqueMagico(atacante: Personagem, alvo: Personagem): number {
    const dano = logicaDanoMagico(atacante);
    alvo.hp = Math.max(0, alvo.hp - dano);
    return dano;
}

export function executarHabilidadeEspecial(atacante: Personagem, alvo: Personagem): string {
    const custoMana = 20;

    if (atacante.mana < custoMana) {
        return "⚠️ Mana insuficiente para canalizar o poder cósmico!";
    }

    atacante.mana -= custoMana;
    const classe = atacante.classe as ClassesJogo;

    switch (classe) {
        case 'LUMINAR':
            const escudo = atacante.inteligencia * 2;
            atacante.hp += escudo;
            return `🌠 LUMINAR: Você invocou o Brilho Eterno! Ganhou ${escudo} de barreira de luz.`;

        case 'ENTROPISTA':
            const degradacao = 5;
            alvo.defesa = Math.max(0, alvo.defesa - degradacao);
            const danoEntropia = atacante.inteligencia + 5;
            alvo.hp -= danoEntropia;
            return `🌒 ENTROPISTA: Você acelerou o desgaste do inimigo! A defesa dele caiu em ${degradacao} e sofreu ${danoEntropia} de dano.`;

        case 'CANTOR_DE_EALEN':
            alvo.velocidade = Math.max(1, alvo.velocidade - 5);
            const danoSonico = atacante.inteligencia * 1.2;
            alvo.hp -= danoSonico;
            return `🎵 CANTOR: A Nota de Nareth pesou sobre o inimigo! Velocidade reduzida drasticamente e ${danoSonico.toFixed(0)} de dano.`;

        case 'GUARDIAO_SINGULARIDADE':
            const danoGravidade = atacante.defesa + atacante.forca;
            alvo.hp -= danoGravidade;
            return `🌌 GUARDIÃO: Você liberou um Pulso de Singularidade! O impacto da massa causou ${danoGravidade} de dano massivo.`;

        case 'SOMBRILICO':
            const manaDrenada = 20;
            alvo.mana = Math.max(0, alvo.mana - manaDrenada);
            atacante.mana = Math.min(atacante.manaMax, atacante.mana + (manaDrenada / 2));
            const danoVazio = atacante.inteligencia;
            alvo.hp -= danoVazio;
            return `🌑 SOMBRÍLICO: O Silêncio devorou a magia do inimigo! Drenou ${manaDrenada} de mana e causou ${danoVazio} de dano.`;

        case 'VIAJANTE_TALUEN':
            const golpe1 = (atacante.forca * 0.8) - (alvo.defesa * 0.5);
            const golpe2 = (atacante.forca * 0.8) - (alvo.defesa * 0.5);
            const totalDano = Math.max(0, golpe1) + Math.max(0, golpe2);
            alvo.hp -= totalDano;
            return `⏳ VIAJANTE: Você atacou no presente e no passado ao mesmo tempo! Dano total: ${totalDano.toFixed(0)}.`;

        case 'FORJARDENTE':
            const danoFogo = (atacante.forca * 0.7) + (atacante.inteligencia * 0.7);
            const danoReal = Math.max(0, danoFogo - (alvo.defesa / 2));
            alvo.hp -= danoReal;
            return `🔥 FORJARDENTE: A lâmina de estrela queimou a armadura! Causou ${danoReal.toFixed(0)} de dano ignorando parte da defesa.`;

        case 'LUNATH_ANCESTRAL':
            const cura = atacante.inteligencia * 3;
            atacante.hp = Math.min(atacante.hpMax, atacante.hp + cura);
            return `🌿 LUNATH: A Luz antiga restaurou seu corpo em ${cura} HP.`;

        case 'RACHADOR_HARMONIA':
            const danoPuro = atacante.forca * 1.5;
            alvo.hp -= danoPuro;
            return `🎯 RACHADOR: Flecha Ressonante atravessou a matéria! ${danoPuro.toFixed(0)} de dano verdadeiro.`;

        case 'MISTICO_ENTALMA':
            atacante.defesa += 5;
            const danoVibracao = atacante.inteligencia;
            alvo.hp -= danoVibracao;
            return `⚛️ MÍSTICO: Você alterou a densidade do ar. Ganhou +5 de Defesa e causou ${danoVibracao} de dano vibratório.`;

        default:
            return "Você tentou usar um poder, mas nada aconteceu.";
    }
}

export function curar(alvo: Personagem): number {
    if (alvo.qtdPot <= 0) return 0;

    alvo.qtdPot -= 1;

    const d20 = rolarDadodd20();

    if (d20 === FALHA) return 0;

    let valorCura = d20 + 3;

    if (d20 === CRITICO) {
        valorCura *= 2;
    }

    const hpAntes = alvo.hp;

    alvo.hp = Math.min(alvo.hpMax, alvo.hp + valorCura);

    return alvo.hp - hpAntes;
}