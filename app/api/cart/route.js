import { Router } from "express";
import { getById, remove, update } from "./controller.js";

const router = Router()

router.get('/', getById)
router.delete('/:id', remove)
router.patch('/:id', update)

export { router as cartRoutes }