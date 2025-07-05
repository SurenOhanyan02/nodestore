import { ErrorService } from '../../services/error-service.js'
import { prisma } from '../../services/prisma.js'

export const getAll = async () => {
    const data = await prisma.category.findMany()
    if (!data) {
        throw ErrorService.BadRequestError()
    }
    return data
}

export const getById = async (id) => {
    const categories = await prisma.category.findFirst({
        where: {
            id: +id
        }
    })
    if (!categories) {
        throw ErrorService.BadRequestError()
    }

    return categories
}

export const create = async ({ title }) => {
    const response = await prisma.category.create({
        data: {
            title,
        }
    })
    if (!response) {
        throw ErrorService.BadRequestError()
    }
    return true
}

export const update = async ({ id, title }) => {
    const response = await prisma.category.update({
        where: {
            id: +id
        },
        data: {
            title,
        }
    })
    if (!response) {
        throw ErrorService.BadRequestError()
    }
    return true
}

export const remove = async (id) => {
    const response = await prisma.category.delete({
        where: {
            id: +id
        },
    })
    if (!response) {
        throw ErrorService.BadRequestError()
    }
    return true
}