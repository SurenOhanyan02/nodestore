import * as orderModel from './model.js'
export const createPage = (req, res) => {
    res.render('order/new-order',
        { error: req.session.error }
    )
    delete req.session.error
}
export const create = async (req, res) => {
    try {
        console.log(req.session.user, res.locals.cart);
        const userId = req.session?.user?.id
        const total = res.locals?.cart?.totalPrice
        const cartItems = res.locals?.cart?.items
        const cartId = res.locals?.cart?.id
        const { phone, address } = req.body
        const result = await orderModel.create({ userId, total, phone, address, cartItems, cartId })
        res.redirect('/checkout')
    } catch (error) {
        req.session.error = error.message
        res.redirect('/checkout')
    }
}



export const remove = async (req, res) => {
    delete req.session.error
    try {
        await orderModel.remove(req.params.id)
        req.session.success = { status: true, message: 'Order Deleted' }
        res.redirect('/admin/order')
    } catch (error) {
        req.session.error = error.message
        res.redirect('/admin/order')
    }
}