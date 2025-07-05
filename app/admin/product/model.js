import { prisma } from '../../services/prisma.js'
import { ErrorService } from '../../services/error-service.js'
import { removeUploadedFile } from '../helpers/remove-uploaded-file.js'
export const getAll = async () => {
    const data = await prisma.product.findMany({
        include: {
            category: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
    if (!data) {
        throw ErrorService.BadRequestError()
    }
    return data
}

export const getById = async (id) => {
    const data = await prisma.product.findFirst({
        where: {
            id: +id
        },
    })
    if (!data) {
        throw ErrorService.BadRequestError()
    }
    return data
}

export const create = async (req) => {
    const { title, price, description, categoryId } = req.body
    const imagePath = req.filePath
    const response = await prisma.product.create({
        data: {
            title,
            price: +price,
            description,
            image: imagePath,
            categoryId: +categoryId
        }
    })
    if (!response) {
        throw ErrorService.BadRequestError()
    }
    return true
}

export const update = async (req) => {
    const { id, title, price, description, categoryId } = req.body
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!product) {
        req.session.error = 'Product not found';
        throw ErrorService.BadRequestError()
    }
    let imagePath = product.image

    if (req.file) {
        if (product.image) {
            await removeUploadedFile(product.image)
        }
        imagePath = req.filePath;
    }
    const response = await prisma.product.update({
        where: {
            id: +id
        },
        data: {
            title,
            price: +price,
            description,
            image: imagePath,
            categoryId: +categoryId
        }
    })
    if (!response) {

        throw ErrorService.BadRequestError()
    }
    return true
}

export const remove = async (id) => {

    const product = await prisma.product.findFirst({
        where: {
            id: +id
        }
    })
    if (!product) {
        throw ErrorService.BadRequestError()
    }
    if (product.image) {
        await removeUploadedFile(product.image)
    }

    const response = await prisma.product.delete({
        where: {
            id: +id
        }
    })
    if (!response) {
        throw ErrorService.BadRequestError()
    }
    return true
}