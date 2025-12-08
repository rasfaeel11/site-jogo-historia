import { Request, Response } from "express";
import { gameService } from "../service/GameService";
import { AcaoCombate } from "../model/GameTypes";

export const jogar = async(req: Request, res: Response) => {
    try {
        const { acao, gameId } = req.body;

        if(!gameId) {
            return res.status(400).json({ erro: "gameId é obrigatório" });
        }

        const acoesValidas = ['ATACAR', 'CURAR', 'MAGIA', 'FUGIR'];
        if(!acoesValidas.includes(acao)){
            return res.status(400).json({ erro: `Ação inválida! Use: ${acoesValidas.join(', ')}` });
        }


        const resultado = await gameService.processarTurno(gameId, acao as AcaoCombate);

        res.json(resultado);

    } catch (error: any) {
        res.status(400).json({ erro: error.message });
    }
}