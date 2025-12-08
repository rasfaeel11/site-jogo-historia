import { Router } from "express";
import { jogar } from "../controllers/jogarController";
const router = Router();

router.post('/', jogar);
export default router;