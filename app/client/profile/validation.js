import Joi from "joi";

export default {
    settingsSchema: {
        body: Joi.object({
            first_name: Joi.string().max(20)
                .regex(/^[a-zA-Zա-ևԱ-Ֆа-яА-Я ]+$/)
                .message("First name can't contain number or symbol")
                .required(),
            last_name: Joi.string().max(20)
                .regex(/^[a-zA-Zա-ևԱ-Ֆа-яА-Я ]+$/)
                .message("Last name can't contain number or symbol")
                .required(),
            email: Joi.string()
                .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .message("Invalid email format")
                .required(),
            password: Joi.string()
                .min(8)
                .message("Password should be have minimum 8 characters")
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
                .message("Password should be include uppercase and lowercase letters,numbers and symbols")
        })
    }
}