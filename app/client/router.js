import { Router } from "express"
import { categoryRoutes } from "./category/route.js"
import { productRoutes } from "./product/route.js"
import { homeRoutes } from "./static/route.js"
import { authRoutes } from "./auth/route.js"
import { profileRoutes } from "./profile/route.js"
import { authMiddleware } from "../middlewares/auth-middleware.js"
import { setUser } from "../middlewares/set-user-middleware.js"
import { cartRoutes } from "./cart/route.js"
import { orderRoutes } from "./order/route.js"

const router = Router()

router.use('/', setUser, homeRoutes)
router.use('/', authRoutes)
router.use('/products', setUser, productRoutes)
router.use('/category', setUser, categoryRoutes)
router.use('/profile', authMiddleware, setUser, profileRoutes)
router.use('/cart', authMiddleware, setUser, cartRoutes)
router.use('/checkout', authMiddleware, setUser, orderRoutes)

export { router as clientRoutes }