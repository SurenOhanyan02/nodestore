import * as categoryModel from './model.js'

export const getById = async (req, res) => {
    try {
        const category = await categoryModel.getById(req.params.id);
        const categories = await categoryModel.getAll();
        res.render('product/single-category.hbs', {
            category: {
                id: category?.id,
                title: category?.title
            },
            products: category?.products,
            categories
        })
    }
    catch (error) {
        res.render('product/single-category.hbs', {
            notFoundMessage: 'No category found yet'
        })
    }
}