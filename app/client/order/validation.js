import Joi from "joi";

export default {
    orderSchema: {
        body: Joi.object({
            address: Joi.string().required(),
            phone: Joi.string().regex(/^374\d{8}$/).message('Invalid Phone Number Format').required()
        })
    }
}