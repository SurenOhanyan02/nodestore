import * as productModel from './model.js'
import * as categoryModel from '../category/model.js'

export const list = async (req, res) => {
    const products = await productModel.getAll();
    const { success } = req.session
    req.session.success = null
    res.render('admin/product/product-list.hbs', {
        layout: 'admin',
        active: 'product-list',
        dataTable: true,
        products,
        success
    })
}

export const createPage = async (req, res) => {
    const categories = await categoryModel.getAll()
    res.render('admin/product/add-product.hbs', {
        error: req.session.error,
        layout: 'admin',
        categories,
    })
    delete req.session.error
}

export const create = async (req, res) => {
    try {
        const response = await productModel.create(req)
        req.session.success = response ? { status: true, message: 'Product add successful' } : { status: false, message: 'Something went wrong' }
        res.redirect('/admin/products')
    } catch (error) {
        req.session.error = error.message
        res.redirect('/admin/products/create')
    }
}

export const updatePage = async (req, res) => {
    try {
        const productId = req.params.id
        const categories = await categoryModel.getAll()
        const product = await productModel.getById(productId)
        res.render('admin/product/update-product.hbs', {
            layout: 'admin',
            categories,
            product,
            error: req.session.error,
        })
        delete req.session.error
    } catch (error) {
        res.redirect('/admin/products')
    }
}

export const update = async (req, res) => {
    try {
        await productModel.update(req)
        req.session.success = { status: true, message: 'Product Updated' }
        res.redirect('/admin/products')
    } catch (error) {
        const id = req.body.id
        req.session.error = error.message
        res.redirect(`admin/products/update/${id}`)
    }
}
export const remove = async (req, res) => {
    delete req.session.error
    try {
        await productModel.remove(req.params.id)
        req.session.success = { status: true, message: 'Product Deleted' }
        res.redirect('/admin/products')
    } catch (error) {
        req.session.error = error.message
        res.redirect('/admin/products')
    }
}