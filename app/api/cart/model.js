import { prisma } from "../../services/prisma.js"
import { CartDTO } from "../../dto/cart.js"
import { ErrorService } from '../../services/error-service.js'
import { handleDatabaseError } from "../../helpers/handleDatabaseErrors.js"
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
        const cartCount = await prisma.cartItem.count({
            where: {
                cartId: cart.id
            }
        })
        return {
            cart: cartDTO,
            totalPrice,
            cartCount
        }
    } catch (error) {
        handleDatabaseError(error, { cartId: id, operation: 'API:Cart getById' });
    }
}

export const remove = async (id) => {
    try {
        const cart = await prisma.cartItem.findUnique({
            where: {
                id: +id
            },
        })
        if (cart) {
            await prisma.cartItem.delete({
                where: {
                    id: +id
                },
            })
            return true
        }
        return false
    } catch (error) {
        handleDatabaseError(error, { cartItemId: id, operation: 'API:Cart remove' });
    }
}

export const update = async ({ cartItemId, quantity }) => {
    const cartItem = await prisma.cartItem.findUnique({
        where: {
            id: +cartItemId
        }
    })
    if (!cartItem) throw ErrorService.NotFoundErrorCreator('Cart item not found')

    if (quantity < 1) {

        await prisma.cartItem.delete({ where: { id: cartItemId } })
        return null
    }

    return await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity }
    })
}