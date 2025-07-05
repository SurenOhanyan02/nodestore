import { ORDER_STATUSES } from '../../constants/constants.js'
import * as orderModel from './model.js'
import * as productModel from '../product/model.js'
import { response } from 'express'
export const list = async (req, res) => {
    try {
        const orders = await orderModel.getAll()
        const { success } = req.session
        res.render('admin/order/order-list.hbs', {
            layout: 'admin',
            active: 'order-list',
            dataTable: true,
            orders,
            success
        })
        delete req.session.success
        delete req.session.error
    } catch (error) {
        req.session.error = error.message
        res.render('admin/order/order-list.hbs', {
            layout: 'admin',
            active: 'order-list',
            orders,
            error: req.session.error
        })
    }
}

export const updatePage = async (req, res) => {
    try {
        const id = req.params.id
        const order = await orderModel.getById(id)
        res.render('admin/order/update-order.hbs', {
            layout: 'admin',
            order,
            error: req.session.error,
            statuses: ORDER_STATUSES
        })
        delete req.session.error
    } catch (error) {
        res.redirect('/admin/order')
    }
}

export const update = async (req, res) => {
    try {
        await orderModel.update(req)
        req.session.success = { status: true, message: 'Order Updated' }
        res.redirect('/admin/order')
    } catch (error) {
        const { id } = req.body
        req.session.error = error.message
        res.redirect(`admin/order/update/${id}`)
    }
}

export const createPage = async (req, res) => {
    try {
        const products = await productModel.getAll()
        res.render('admin/order/add-order.hbs', {
            error: req.session.error,
            layout: 'admin',
            products
        })
        delete req.session.error
    } catch (error) {
        res.redirect('/admin/order')
    }
}




export const create = async (req, res) => {
    try {
   
        const userId = req.session?.user?.id
        const { phone, address, products } = req.body
        console.log( products);
        const total = products.reduce((acc, product) => {
            return acc + (product.price * product.quantity)
        }, 0)
        console.log('Total:', total);
        const result = await orderModel.create({ userId, total, phone, address, products })
        res.json( result)
    } catch (error) {
        req.session.error = error.message
        res.redirect('/checkout')
    }

}

