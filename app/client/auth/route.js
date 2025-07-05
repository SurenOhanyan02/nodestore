import { Router } from "express";
import { activateUser, forgotPassword, forgotPasswordPage, login, loginPage, logout, register, registerPage, resetPassword, resetPasswordPage } from "./controller.js";
import { authMiddleware } from "../../middlewares/auth-middleware.js";
import { validateMiddleware } from "../../middlewares/validate-middleware.js";
import validations from "./validation.js";

const { registerSchema, forgotPasswordSchema } = validations

const router = Router()
router.get('/register', registerPage)
router.post('/register', validateMiddleware(registerSchema), register)
router.get('/login', loginPage)
router.post('/login', login)
router.get('/logout', authMiddleware, logout)
router.get('/activate/:activationLink', activateUser)
router.get('/reset-password/:resetLink', resetPasswordPage)
router.post('/reset-password', resetPassword)
router.get('/forgot-password', forgotPasswordPage)
router.post('/forgot-password', validateMiddleware(forgotPasswordSchema), forgotPassword)

export { router as authRoutes }