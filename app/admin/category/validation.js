import Joi from "joi";

export default {
    createSchema: {
        body: Joi.object({
            title: Joi.string()
                .regex(/^[a-zA-Zա-ևԱ-Ֆа-яА-Я ]+$/)
                .message("Category title can't contain number or symbol")
                .required()
        })
    },
    updateSchema: {
        body: Joi.object({
            id: Joi.number().required(),
            title: Joi.string()
                .regex(/^[a-zA-Zա-ևԱ-Ֆа-яА-Я ]+$/)
                .message("Category title can't contain number or symbol")
                .required()
        })
    },
    deleteSchema: {
        params: Joi.object({
            id: Joi.number().required(),
        })
    }
}