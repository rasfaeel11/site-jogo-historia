import { Personagem } from "../model/Personagem";

const CRITICO = 20;
const FALHA = 1;

// Função auxiliar para rolar d20
export function rolarDadodd20(): number {
    return Math.floor(Math.random() * 20) + 1;
}

// Calcula o poder bruto do ataque físico (sem contar a defesa do inimigo ainda)
function logicaDanoFisico(personagem: Personagem): number {
    const d20 = rolarDadodd20();

    if (d20 === FALHA) return 0; // Erro crítico: não causa dano

    let danoTotal = d20 + personagem.forca;

    if (d20 === CRITICO) {
        danoTotal *= 2; // Crítico: dobro do dano
    }

    return danoTotal;
}

// Calcula o dano mágico (já desconta mana)
function logicaDanoMagico(personagem: Personagem): number {
    const gastoManaAtaque = 5;

    // Se não tiver mana, falha
    if (personagem.mana < gastoManaAtaque) return 0;

    const d20 = rolarDadodd20();

    if (d20 === FALHA) return 0;

    // Gasta a mana
    personagem.mana -= gastoManaAtaque;

    let danoTotal = d20 + personagem.inteligencia;

    if (d20 === CRITICO) {
        danoTotal *= 2;
    }

    return danoTotal;
}

// --- FUNÇÕES EXPORTADAS (USADAS NO GAMELOOP) ---

export function atacar(atacante: Personagem, alvo: Personagem): number {
    const danoBruto = logicaDanoFisico(atacante);

    // Se o dano bruto for 0 (erro crítico), nem calcula defesa
    if (danoBruto === 0) return 0;

    // ATUALIZAÇÃO: Desconta a defesa do alvo!
    // Se a defesa for maior que o dano, o dano vira 0 (não fica negativo)
    const danoLiquido = Math.max(0, danoBruto - alvo.defesa);

    // Aplica o dano na vida do alvo
    alvo.hp = Math.max(0, alvo.hp - danoLiquido);

    return danoLiquido;
}

export function ataqueMagico(atacante: Personagem, alvo: Personagem): number {
    const dano = logicaDanoMagico(atacante);
    
    // Magia geralmente ignora defesa física, então aplicamos direto
    alvo.hp = Math.max(0, alvo.hp - dano);
    
    return dano;
}

export function curar(alvo: Personagem): number {
    if (alvo.qtdPot <= 0) return 0; 

    alvo.qtdPot -= 1;

    const d20 = rolarDadodd20();
    
    // Se tirar 1 no dado ao tentar curar, derruba o frasco (falha crítica)
    if (d20 === FALHA) return 0;

    let valorCura = d20 + 3; // Cura base

    if (d20 === CRITICO) {
        valorCura *= 2;
    }

    const hpAntes = alvo.hp;

    // Garante que não cura mais que o Máximo
    alvo.hp = Math.min(alvo.hpMax, alvo.hp + valorCura);

    // Retorna quanto curou de verdade (ex: se faltava 5 e curou 20, retorna 5)
    return alvo.hp - hpAntes;
}