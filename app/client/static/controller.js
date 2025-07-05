import * as staticModel from './model.js'
import * as categoryModel from '../category/model.js'

export const homePage = async (req, res) => {
    try {
        const categories = await categoryModel.getAllWithProductsLimit([ 2,3,4])
        const slider = await staticModel.getSlider();
        res.render('home', {
            headline: 'Online Shop',
            slider,
            categories,
            uploadsPath: process.env.UPLOADS_PATH_URL,
        })
    } catch (error) {
        res.render('404')
    }
}

export const contactPage = (req, res) => {
    res.render('contact', {
        headline: 'Contact Page',
    })
}