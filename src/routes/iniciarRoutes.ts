import { Router } from "express";
import { iniciar } from "../controllers/iniciarController";

const router = Router();

router.post('/', iniciar);

export default router;