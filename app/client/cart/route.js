import { Router } from "express";
import { validateMiddleware } from "../../middlewares/validate-middleware.js";
import validation from "./validation.js";
import { create, getById } from "./controller.js";

const { cartItemSchema } = validation
const router = Router()

router.post('/', validateMiddleware(cartItemSchema), create)



router.get('/', getById)

export { router as cartRoutes }