import Joi from "joi"
import mongoose from "mongoose";
// send message schema 
export const sendMessageSchema = {
    body: Joi.object({
        content: Joi.string().min(3).max(500).required().messages({
            "string.empty": "Message content is required",
            "string.min": "Message content cannot be empty",
            "string.max": "Message content is too long (max 500 chars)",
        }),
        ownerId: Joi.string().custom((value, helpers) => {
            return mongoose.Types.ObjectId.isValid(value)
                ? value
                : helpers.error("any.invalid");
        }).required().messages({
            "any.invalid": "Invalid ownerId format",
            "string.empty": "ownerId is required",
        }),
    })

}
