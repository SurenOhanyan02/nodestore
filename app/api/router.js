import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware.js"
import { setUser } from "../middlewares/set-user-middleware.js"
import { cartRoutes } from "./cart/route.js"

const router = Router()

router.use('/cart', authMiddleware, setUser, cartRoutes)

export { router as apiRoutes }