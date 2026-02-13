import { Router } from "express";
import { sendVerificatonCode } from "../../controllers/auth/auth.controller";

export const authRouter = Router()

authRouter.get('/send-code', sendVerificatonCode)