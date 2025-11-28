import { Personagem } from "../model/Personagem";

const CRITICO = 20;
const FALHA = 1;

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



export function rolarDadodd20(): number {
    return Math.floor(Math.random() * 20) + 1;
}

export function atacar(atacante: Personagem, alvo: Personagem): number {
    const dano = logicaDanoFisico(atacante);


    alvo.hp = Math.max(0, alvo.hp - dano);

    return dano;
}

export function ataqueMagico(atacante: Personagem, alvo: Personagem): number {
    const dano = logicaDanoMagico(atacante);
    alvo.hp = Math.max(0, alvo.hp - dano);
    return dano;
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
