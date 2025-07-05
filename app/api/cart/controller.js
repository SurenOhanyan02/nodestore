import * as cartModel from './model.js'
import { ErrorService } from '../../services/error-service.js';
export const getById = async (req, res) => {
    try {
        const user = res.locals.currentUser
        const { cartId } = user
        const data = await cartModel.getById(cartId)
        res.send(data)
    } catch (error) {
        console.log(user);
        console.log(error.message);
        res.send(error.message)
    }
}

export const remove = async (req, res) => {
    try {
        const id = req.params.id
        const response = await cartModel.remove(id)
        res.send(response)
    } catch (error) {
        console.log(error.message);
        res.send(error.message)
    }
}

export const update = async (req, res) => {
    try {
        const quantity = parseInt(req.body.quantity)
        const cartItemId = parseInt(req.params.id)
        if (isNaN(quantity) || quantity < 0 || isNaN(cartItemId)) {

            throw ErrorService.BadRequestError('Invalid input')
        }

        const updatedItem = await cartModel.update({ cartItemId, quantity })
        res.json({ success: true, item: updatedItem })
    } catch (e) {
        res.status(e.status).json({ success: false })
        console.log(e.message);

    }
}