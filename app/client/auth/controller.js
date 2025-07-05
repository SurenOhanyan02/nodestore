import * as authModel from './model.js'

export const registerPage = (req, res) => {
    res.render('auth/register', {
        error: req.session.error,
    })
    delete req.session.error
}

export const register = async (req, res) => {
    try {
        const response = await authModel.register(req.body)
        res.redirect('/login')
    } catch (error) {
        req.session.error = error.message
        res.redirect('/register')
    }
}

export const loginPage = (req, res) => {
    res.render('auth/login', {
        error: req.session.error,
    })
    delete req.session.error
}

export const login = async (req, res) => {
    try {
        const { data } = await authModel.login(req.body)
        req.session.userId = data.id
        req.session.user = data

        res.redirect('/profile')
    } catch (error) {
        req.session.error = error.message
        res.redirect('/login')
    }
}
export const logout = (req, res) => {
    req.session.destroy(() => res.redirect('/login'))
}

export const activateUser = async (req, res) => {
    try {
        const { activationLink } = req.params
        const response = await authModel.activateUser(activationLink)
        res.redirect('/login')
    } catch (error) {
        req.session.error = error.message
        res.redirect('/login')
    }
}

export const forgotPasswordPage = async (req, res) => {
    res.render('auth/forgot-password', {
        error: req.session.error,
    })
    delete req.session.error
}
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const isResetLinkSet = await authModel.setResetLink(email)
        if (isResetLinkSet) {
            res.redirect('/login')
        }
        else {
            res.redirect('/forgot-password')
        }
    } catch (error) {
        req.session.error = error.message
        res.redirect('/forgot-password')
    }
}

export const resetPasswordPage = async (req, res) => {
    try {
        const { resetLink } = req.params
        const user = await authModel.validateResetLink(resetLink)

        if (user) {
            res.render('auth/reset-password', {
                userID: user.id
            })
        }
        else {
            res.render('404')
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/login')
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { userId, password } = req.body
        await authModel.resetPassword(userId, password)
        res.redirect('/login')

    } catch (error) {
        console.log(error.message);
        res.redirect('/login')
    }
}