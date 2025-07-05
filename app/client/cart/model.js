import { prisma } from '../../services/prisma.js'
import { ErrorService } from '../../services/error-service.js'
import { Prisma } from '@prisma/client'
import { CartDTO } from '../../dto/cart.js'

export const create = async ({ cartId, productId, quantity }) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                id: +cartId
            }
        })
        if (!cart) {
            throw ErrorService.BadRequestError('Cart not found')
        }

        const product = await prisma.product.findFirst({
            where: {
                id: +productId
            }
        })

        if (!product) {
            throw ErrorService.BadRequestError('Product not found')
        }

        const existItem = await prisma.cartItem.findUnique({
            where: {
                productId_cartId: {
                    productId: +productId,
                    cartId: +cartId,
                }
            }
        })
        if (existItem) {
            const cartItem = await prisma.cartItem.update({
                where: {
                    productId_cartId: {
                        productId: +productId,
                        cartId: +cartId,
                    }
                },
                data: {
                    quantity: existItem.quantity += 1
                }
            })
            return cartItem
        }
        const cartItem = await prisma.cartItem.create({
            data: {
                productId: +productId,
                cartId: +cartId,
                quantity
            }
        })
        return cartItem
    }
    catch (error) {
        console.log(error.message);

        if (error instanceof ErrorService) {
            throw error
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
            throw ErrorService.BadRequestError('Invalid input format')
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                throw ErrorService.BadRequestError('Invalid cart or product reference')
            }
            if (error.code === 'P2002') {
                throw ErrorService.BadRequestError('This item already exists')
            }
        }

        throw ErrorService.BadRequestError(error.message || 'Unexpected error occurred')
    }
}

export const getById = async (id) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: {
                id: +id
            },
            select: {
                items: {
                    select: {
                        id: true,
                        quantity: true,
                        product: true
                    }
                }
            }
        })
        const cartDTO = cart.items?.map((item) => ({ ... new CartDTO(item) }))

        const totalPrice = cartDTO.reduce((acc, item) => {
            return acc + Number(item.price) * Number(item.quantity)
        }, 0)

        return {
            cart: cartDTO,
            totalPrice,
        }
    } catch (error) {
        console.log(error.message);

        if (error instanceof ErrorService) {
            throw error
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
            throw ErrorService.BadRequestError('Invalid input format')
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
                throw ErrorService.BadRequestError()
            }
            if (error.code === 'P2002') {
                throw ErrorService.BadRequestError()
            }
        }

        throw ErrorService.BadRequestError(error.message || 'Unexpected error occurred')
    }
}