import { Router } from "express";
import { login, loginPage, logout, register, registerPage } from "./controller.js";

import { validateMiddleware } from "../../middlewares/validate-middleware.js";
import validations from "./validation.js";
import { adminMiddleware } from "../../middlewares/admin-middleware.js";

const { registerSchema } = validations

const router = Router()
router.get('/register', registerPage)
router.post('/register', validateMiddleware(registerSchema), register)
router.get('/login', loginPage)
router.post('/login', login)
router.get('/logout', adminMiddleware, logout)

export { router as authRoutes }