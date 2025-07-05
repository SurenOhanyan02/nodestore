import { USER_ROLES } from "../constants/constants.js"

export const adminMiddleware = (req, res, next) => {
    if (req.session.userId && req.session.user.role === USER_ROLES.admin) return next()
    return res.redirect('/admin/login')
}