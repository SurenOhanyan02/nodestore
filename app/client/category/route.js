import { Router } from "express";
import { getById } from "./controller.js";


const router = Router();
router.get('/:id', getById)

export { router as categoryRoutes }