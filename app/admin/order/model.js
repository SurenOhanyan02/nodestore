import { handleDatabaseError } from "../../helpers/handleDatabaseErrors.js";
import { prisma } from '../../services/prisma.js'

export const getAll = async () => {
    try {
        const response = prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true
                    }
                }
            }
        });
        return response
    } catch (error) {
        handleDatabaseError(error, { operation: 'Order: getAll' });
    }
}

export const getById = async (id) => {
    try {
        const response = prisma.order.findFirst({
            where: {
                id: +id
            },
            include: {
                items: true,
                user: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true
                    }
                }
            }
        });
        return response
    } catch (error) {
        handleDatabaseError(error, { operation: 'Order: getAll' });
    }
}

export const update = async (req) => {
    const { id, address, phone, status } = req.body
    try {
        const response = prisma.order.update({
            where: {
                id: +id
            },
            data: {
                address,
                phone,
                status
            }
        });
        return response
    } catch (error) {
        handleDatabaseError(error, { operation: 'Order: getAll' });
    }
}




export const create = async ({ userId, total, products, phone, address }) => {
    try {
        const result = await prisma.order.create({
            data: {
                userId,
                total,
                phone,
                address,
                items: {
                    create: products.map(item => ({
                        productId: +item.productId,
                        quantity: +item.quantity,
                        title: item.title,
                        priceAtTime: +item.price,
                    }))
                }
            }
        });
        if (result) {
        
            return true
        }
        return false

    } catch (error) {
        handleDatabaseError(error, { userId, total, products, operation: 'Create Order' });
    }
}