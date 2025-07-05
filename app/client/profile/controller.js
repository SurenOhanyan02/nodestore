import * as profileModel from './model.js'

export const profilePage = (req, res) => {
    res.render('profile/profile')
}
export const orderPage = (req, res) => {
    res.render('profile/orders')
}
export const settingsPage = (req, res) => {
    res.render('profile/settings', {
        error: req.session.error
    })
    delete req.session.error
}

export const updateSettings = async (req, res) => {
    try {
        const response = await profileModel.update(req.body)
        res.redirect('/profile')
    } catch (error) {
        req.session.error = error.message
        res.redirect('/profile/settings')
    }
}