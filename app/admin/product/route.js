import { Router } from "express";
import { create, createPage, list, remove, update, updatePage } from "./controller.js";
import { validateMiddleware } from "../../middlewares/validate-middleware.js";
import validation from "./validation.js";
import { uploadFileMiddleware } from "../../middlewares/upload-middleware.js";

const { createSchema, updateSchema, deleteSchema } = validation
const router = Router();

router.get('/', list);
router.get('/create', createPage);
router.post('/create', uploadFileMiddleware('image',
    {
        allowedTypes: ['.jpg', '.jpeg', '.png', '.webp'],
        maxSizeMB: 3,
        prefix: 'product',
        subFolder: 'products'
    }
), validateMiddleware(createSchema), create);
router.get('/update/:id', updatePage);
router.post('/update', uploadFileMiddleware('image',
    {
        allowedTypes: ['.jpg', '.jpeg', '.png', '.webp'],
        maxSizeMB: 3,
        prefix: 'product',
        subFolder: 'products'
    }
), validateMiddleware(updateSchema), update);
router.get('/delete/:id', validateMiddleware(deleteSchema), remove);

export { router as productRoutes }
