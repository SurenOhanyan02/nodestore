export const validateMiddleware = (schema, type = 'admin') => {

    if (typeof schema !== "object" || schema === null) throw new Error("Schema is not an object");

    return async (req, res, next) => {
        delete req.session.error
        const { params, body } = req;
        try {
            schema.params && (await schema.params.validateAsync(params));
            schema.body && (await schema.body.validateAsync(body));
            next();
        } catch (error) {
            req.session.error = error.details[0].message
            if (req.filePath) {
                await removeUploadedFile(req.filePath);
            }
            res.redirect(req.get("Referrer") || `/${type}`)
        }
    };
};
