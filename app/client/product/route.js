import { Router } from "express";
import { getAll, getById } from "./controller.js";

const router = Router();

router.get('/', getAll)
router.get('/:id', getById)

export { router as productRoutes }