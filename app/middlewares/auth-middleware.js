export const authMiddleware = (req, res, next) => {
    if (req.session.userId) return next()
    return res.redirect('/login')
}