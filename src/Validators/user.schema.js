import Joi from "joi";

// update password schema
export const updatePasswordSchema = {
    body: Joi.object({
        oldPassword: Joi.string().min(6).required().messages({
            "string.empty": "Old password is required",
            "string.min": "Password must be at least 6 characters",
        }),
        newPassword: Joi.string().min(6).required().messages({
            "string.empty": "New password is required",
            "string.min": "Password must be at least 6 characters",
        }),
        confirmedPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
            "any.only": "Confirmed password must match new password",
        }),
    })
}

// update profile schema
export const updateProfileSchema = {
    body: Joi.object({
        username: Joi.string().min(3).max(20).required().messages({
            "string.empty": "Username is required",
            "string.min": "Username must be at least 3 characters",
            "string.max": "Username cannot exceed 20 characters",
        }),
        email: Joi.string().email().required().messages({
            "string.empty": "Email is required",
            "string.email": "Invalid email format",
        }),
        phone: Joi.string().pattern(/^\d{10,15}$/).required().messages({
            "string.empty": "Phone number is required",
            "string.pattern.base": "Phone number must be between 10-15 digits",
        }),
    })
}