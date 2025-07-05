import { Router } from "express";

import { authRoutes } from "./auth/route.js";
import { categoryRoutes } from "./category/route.js";
import { productRoutes } from "./product/route.js";
import { staticRoutes } from "./static/route.js";

import { setUser } from "..//middlewares/set-user-middleware.js";
import { adminMiddleware } from "../middlewares/admin-middleware.js";
import { orderRoutes } from "./order/route.js";

const router = Router();

router.use('/', staticRoutes)
router.use('/', authRoutes)
router.use('/category', adminMiddleware, setUser, categoryRoutes)
router.use('/products', adminMiddleware, setUser, productRoutes)
router.use('/order', adminMiddleware, setUser, orderRoutes)

export { router as adminRoutes }