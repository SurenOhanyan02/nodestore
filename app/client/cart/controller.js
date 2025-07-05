import * as cartModel from './model.js'

export const create = async (req, res) => {
    try {
        const user = res.locals.currentUser
        const { quantity, productId } = req.body
        const cartId = user?.cartId
        const cartItem = await cartModel.create({ cartId, quantity, productId })
        res.send(cartItem)
    } catch (error) {
        console.log(error.message);
        res.status(error.status).send(error.message)
    }
}

export const getById = async (req, res) => {
    try {
        const user = res.locals.currentUser
        const cartId = user?.cartId
        const { cart, totalPrice } = await cartModel.getById(cartId)
        res.render('cart/cart', {
            cart,
            totalPrice
        })
    } catch (error) {

    }
}