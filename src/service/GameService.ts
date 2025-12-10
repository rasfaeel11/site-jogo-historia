import { supabase } from "../config/supabaseClient";
import { GameLoop } from "../service/CombatManager/GameLoop"; 
import { AcaoCombate, ClassesJogo } from "../model/GameTypes";

export class GameService {


    async iniciarNovoJogo(nome: string, classe: string) {
        const jogo = new GameLoop();
        
        const personagemInicial = jogo.iniciarJogo(nome, classe as ClassesJogo);
        const inimigoInicial = jogo.getAlvo();


        const { data, error } = await supabase
            .from('partidas')
            .insert({
                heroi_data: personagemInicial,
                inimigo_data: inimigoInicial,
                status: 'EM_ANDAMENTO',
                logs: []
            })
            .select()
            .single();

        if (error) throw new Error(`Erro ao criar jogo: ${error.message}`);

        return { 
            id: data.id, 
            personagem: data.heroi_data 
        };
    }


    async processarTurno(jogoId: string, acao: AcaoCombate) {

        const { data: jogoSalvo, error: erroBusca } = await supabase
            .from('partidas')
            .select('*')
            .eq('id', jogoId)
            .single();

        if (erroBusca || !jogoSalvo) throw new Error("Jogo não encontrado.");
        if (jogoSalvo.status !== 'EM_ANDAMENTO') throw new Error("Jogo já finalizado.");


        const jogo = new GameLoop();
        jogo.carregarEstado(jogoSalvo.heroi_data, jogoSalvo.inimigo_data);


        const resultado = jogo.processarTurno(acao);

        const { error: erroUpdate } = await supabase
            .from('partidas')
            .update({
                heroi_data: jogo.getPrincipal(),
                inimigo_data: jogo.getAlvo(),
                logs: resultado.logs,
                status: resultado.jogoContinua ? 'EM_ANDAMENTO' : 'FINALIZADO'
            })  
            .eq('id', jogoId);

        if (erroUpdate) throw new Error("Erro ao salvar turno.");

        return {
            ...resultado, // Espalha (jogoContinua, logs)
            heroi: jogo.getPrincipal(), // Adiciona o herói atualizado
            inimigo: jogo.getAlvo()     // Adiciona o inimigo atualizado
        };
    }
}

export const gameService = new GameService();