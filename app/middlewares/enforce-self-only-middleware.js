export const enforceSelfOnly = ({ source = 'body', key = 'id', error = 'You don`t have permission for this action' }) => {
    return (req, res, next) => {
        const userId = res.locals.currentUser?.id;
        const incomingId = req[source]?.[key];

        if (Number(userId) !== Number(incomingId)) {
            req.session.error = error
            return res.redirect(req.get("Referrer") || "/")
        }
        next();
    };
};
