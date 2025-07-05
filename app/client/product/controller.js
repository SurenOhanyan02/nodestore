import * as categoryModel from "../category/model.js";
import * as productModel from "./model.js";

export const getById = async (req, res) => {
    const product = await productModel.getById(+req.params.id);
    res.render('product/single-product.hbs', {
        product,
    })
}

export const getAll = async (req, res) => {
    try {
        const products = await productModel.getAll();
        const categories = await categoryModel.getAll();
        res.render('product/product.hbs', {
            products,
            categories
        })
    }
    catch (error) {
        res.render('product/product.hbs', {
            notFoundMessage: 'No products found yet'
        })
    }
}