import { Router } from "express";
import { LeaderboardController } from "../controllers/leaderboardController";

const leaderboardController = new LeaderboardController();
const router = Router();

router.get('/', leaderboardController.listar.bind(leaderboardController))

export default router;