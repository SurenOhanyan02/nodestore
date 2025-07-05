import { prisma } from '../../services/prisma.js'
import { ErrorService } from '../../services/error-service.js'
export const getAll = async () => {
    const data = await prisma.category.findMany({
        select: {
            id: true,
            title: true
        }
    })
    if (!data) {
        throw ErrorService.NotFoundErrorCreator()
    }
    return data
}

export const getById = async (id) => {
    const data = await prisma.category.findFirst({
        where: {
            id: +id
        },
        select: {
            id: true,
            title: true,
            products: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    image: true,

                }
            }
        }
    })

    if (!data) {
        throw ErrorService.NotFoundErrorCreator()
    }
    return data
}

export const getAllWithProductsLimit = async (categoryIds = []) => {
    const categories = await prisma.category.findMany({
        where: {
            id: { in: categoryIds },
            products: {
                some: {},
            }
        },
        select: {
            id: true,
            title: true
        },
    })
    if (!categories) {
        throw ErrorService.NotFoundErrorCreator()
    }
    const categoriesWithProducts = await Promise.all(
        categories.map(async (category) => {
            const products = await prisma.product.findMany({
                where: {
                    categoryId: category.id,
                },
                take: 4,
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return {
                ...category,
                products,
            };
        })
    );
    return categoriesWithProducts
}