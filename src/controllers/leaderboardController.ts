import { Request, Response } from 'express';
import { gameService } from '../service/GameService';

export class LeaderboardController {
    async listar(req: Request, res: Response) {
        try {
            const lendas = await gameService.listarLendas();
            res.json(lendas);
        } catch (error: any) {
            res.status(500).json({ erro: error.message });
        }
    }
}