import { Router } from "express";
import { create, createPage,remove } from "./controller.js";
import { validateMiddleware } from "../../middlewares/validate-middleware.js";
import validation from "./validation.js";
const router = Router()
const { orderSchema } = validation
router.get('/', createPage)
router.post('/', validateMiddleware(orderSchema), create)
router.delete('/delete/:id', remove);
export { router as orderRoutes }




