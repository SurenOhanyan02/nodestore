import Joi from "joi";

export default {
    createSchema: {
        body: Joi.object({
            title: Joi.string().max(100)
                .required(),
            price: Joi.number().required(),
            description: Joi.string().allow(null, ''),
            categoryId: Joi.number()
        })
    },
    updateSchema: {
        body: Joi.object({
            id: Joi.number().required(),
            title: Joi.string().max(100)
                .required(),
            price: Joi.number().required(),
            description: Joi.string().allow(null, ''),
            categoryId: Joi.number()
        })
    },
    deleteSchema: {
        params: Joi.object({
            id: Joi.number().required(),
        })
    }
}