import Joi from "joi";

export const signupSchema = {
    body: Joi.object({
        username: Joi.string().min(3).max(15).required().messages({
            "string.max": "length must be less than or equal to 15 characters long"
        }),
        email: Joi.string().email(),
        password: Joi.string().required(),
        phone: Joi.string().required(),
        gender: Joi.string().required(),
        age: Joi.number().required(),
    })
}