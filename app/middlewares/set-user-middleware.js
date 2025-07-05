import { CartDTO } from "../dto/cart.js";
import Logger from "../services/Logger.js";
import { prisma } from "../services/prisma.js";

export const setUser = async (req, res, next) => {
    const userId = req.session?.user?.id
    if (!userId) {
        return next()
    }
    const user = await prisma.user.findFirst({
        where: { id: +userId },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            cart: {
                select: {
                    id: true,
                    items: {
                        select: {
                            id: true,
                            quantity: true,
                            product: true
                        }
                    }
                }
            }
        }
    })
    const cartDTO = user?.cart.items?.map((item) => ({ ... new CartDTO(item) }))

    const totalPrice = cartDTO.reduce((acc, item) => {
        return acc + Number(item.price) * Number(item.quantity)
    }, 0)

    const userCartCount = await prisma.cartItem.count({
        where: {
            cartId: +user.cart?.id
        }
    })

    res.locals.currentUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        cartId: user.cart?.id
    } || null;
    res.locals.userCartCount = userCartCount || 0;
    res.locals.cart = {
        id: user.cart?.id,
        items: cartDTO,
        totalPrice
    }
    next();
}