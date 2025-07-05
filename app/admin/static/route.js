import { Router } from "express";
import { setUser } from "../../middlewares/set-user-middleware.js";
import { dashboardPage } from "./controller.js";
import { adminMiddleware } from "../../middlewares/admin-middleware.js";

const router = Router();
router.get('/', adminMiddleware, setUser, dashboardPage);
router.get('/dashboard', adminMiddleware, setUser, dashboardPage);

export { router as staticRoutes }