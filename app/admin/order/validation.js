import Joi from "joi";

export default {
    updateSchema: {
        body: Joi.object({
            id: Joi.number().required(),
            address: Joi.string().required(),
            phone: Joi.string().regex(/^374\d{8}$/).message('Invalid Phone Number Format').required(),
            status: Joi.string().valid('COMPLETE', 'PENDING', 'REJECTED', 'DELIVERY').required()
        })
    }
}