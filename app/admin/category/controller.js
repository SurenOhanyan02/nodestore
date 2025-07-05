import * as categoryModel from './model.js'

export const list = async (req, res) => {
    const categories = await categoryModel.getAll();
    const { success } = req.session
    req.session.success = null
    res.render('admin/category/category-list.hbs', {
        layout: 'admin',
        active: 'category-list',
        dataTable: true,
        categories,
        success
    })
}

export const createPage = async (req, res) => {
    res.render('admin/category/add-category.hbs', {
        error: req.session.error,
        layout: 'admin',
    })
    delete req.session.error
}

export const create = async (req, res) => {
    try {
        const response = await categoryModel.create(req.body)
        req.session.success = response ? { status: true, message: 'Category add successful' } : { status: false, message: 'Something went wrong' }
        res.redirect('/admin/category')
    } catch (error) {
        req.session.error = error.message
        res.redirect('/admin/category/create')
    }

}

export const updatePage = async (req, res) => {
    try {
        const id = req.params.id
        const category = await categoryModel.getById(id)
        res.render('admin/category/update-category.hbs', {
            layout: 'admin',
            category,
            error: req.session.error
        })
        delete req.session.error
    } catch (error) {
        res.redirect('/admin/category')
    }
}

export const update = async (req, res) => {
    try {
        await categoryModel.update(req.body)
        req.session.success = { status: true, message: 'Category updated' }
        res.redirect('/admin/category')
    } catch (error) {
        const id = req.body.id
        req.session.error = error.message
        res.redirect(`admin/category/update/${id}`)
    }
}

export const remove = async (req, res) => {
    delete req.session.error
    try {
        const id = req.params.id
        await categoryModel.remove(id)
        req.session.success = { status: true, message: 'Category deleted' }
        res.redirect('/admin/category')
    } catch (error) {
        req.session.error = error.message
        res.redirect('/admin/category')
    }
}