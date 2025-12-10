import { Request, Response } from "express";
import { gameService } from "../service/GameService";

export const iniciar = async(req: Request, res: Response) => {
    try {
        const { nome, classe } = req.body;

        if(!nome || !classe){
            return res.status(400).json({erro: "nome e classe sao obrigatorios"});
        }

        const classesJogo = ['GUERREIRO', 'MAGO'];
        if(!classesJogo.includes(classe)){
            return res.status(400).json({erro: "classe invalida"});
        };


        const resultado = await gameService.iniciarNovoJogo(nome, classe);

        res.json({
            mensagem: "Jogo Iniciado",
            gameId: resultado.id, 
            jogador: resultado.personagem,
            inimigo: resultado.inimigo
        });
    } catch (error: any) {
        res.status(500).json({ erro: error.message });
    }
};