import { Router } from "express";
import { createPage, list, update, updatePage, create } from "./controller.js";
import { validateMiddleware } from "../../middlewares/validate-middleware.js";
import validation from "./validation.js";

const { updateSchema } = validation

const router = Router();
router.get('/', list)
router.get('/update/:id', updatePage)
router.get('/create/', createPage)
router.post('/update', validateMiddleware(updateSchema), update)
router.post('/create', create)

export { router as orderRoutes }