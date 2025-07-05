import Joi from "joi";

export default {
    cartItemSchema: {
        body: Joi.object({
            productId: Joi.number().integer().required(),
            quantity: Joi.number().integer().required()
        })
    }
}