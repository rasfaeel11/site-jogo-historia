import { Request, Response } from "express";
import { GameLoop } from "../service/CombatManager/GameLoop";
import { AcaoCombate } from "../model/GameTypes";

export const jogar = async(req: Request, res: Response) => {
    let jogo = new GameLoop();
    if(!jogo){
        return res.status(400).json({
            erro: "jogo nao iniciado"
        });
    }
    const {acao} = req.body;
    const acoesValidas = ['ATACAR', 'CURAR', 'MAGIA', 'FUGIR'];
    if(!acoesValidas.includes(acao)){
        return res.status(400).json({
            erro: `Ação inválida! Use: ${acoesValidas.join(', ')}`
        });
    }
    const resultado = jogo.processarTurno(acao as AcaoCombate);

    const resposta = {
        jogoContinua: resultado.jogoContinua,
        historicoDeBatalha: resultado.logs, 
        heroi: jogo.getPrincipal(),
        inimigo: jogo.getAlvo()
    };
    if (!resultado.jogoContinua) {
        // Se acabou, adicionamos um log final se quiser
        jogo = null; 
    }
    res.json(resposta);
}