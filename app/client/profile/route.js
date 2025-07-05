import { Router } from "express";
import { orderPage, profilePage, settingsPage, updateSettings } from "./controller.js";
import { enforceSelfOnly } from "../../middlewares/enforce-self-only-middleware.js";

import { validateMiddleware } from "../../middlewares/validate-middleware.js";
import validation from "./validation.js";

const { settingsSchema } = validation

const router = Router()
router.get('/', profilePage)
router.get('/orders', orderPage)
router.get('/settings', settingsPage)
router.post('/settings', enforceSelfOnly({}), validateMiddleware(settingsSchema), updateSettings)

export { router as profileRoutes }