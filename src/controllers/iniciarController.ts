import { Request, Response } from "express";
import { GameLoop } from "../service/CombatManager/GameLoop";
import { ClassesJogo } from "../model/GameTypes";

export const iniciar = async(req: Request, res: Response) => {
    const {nome, classe} = req.body;

    if(!nome || !classe){
        return res.status(400).json({erro: "nome e classe sao obrigatorios"})
    }
    const classesJogo: ClassesJogo[] = ['GUERREIRO', 'MAGO'];
    
    if(!classesJogo.includes(classe)){
        return res.status(400).json({erro: "classe invalida"})
    };

    let jogo = new GameLoop();
    const personagem = jogo.iniciarJogo(nome, classe);

    res.json({
        mensagem: "Jogo Iniciado",
        jogador: personagem
    });
};