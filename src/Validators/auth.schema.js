import Joi from "joi";

// signup schema
export const signupSchema = {
  body: Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must be at most 30 characters",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),

    phone: Joi.string()
      .pattern(/^\+?[0-9]{10,15}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be valid",
        "string.empty": "Phone is required",
      }),

    password: Joi.string()
      .min(6)
      .max(50)
      .required()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/
      )
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
        "string.max": "Password must be at most 50 characters",
      }),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
      "string.empty": "Confirm Password is required",
    }),
    gender: Joi.string().valid("male", "female").required().messages({
      "any.only": "Gender must be either 'male' or 'female'",
      "string.empty": "Gender is required",
    }),

    age: Joi.number().min(18).max(100).required().messages({
      "number.base": "Age must be a number",
      "number.min": "You must be at least 18 years old",
      "number.max": "Age must be at most 100",
    }),

    role: Joi.string().valid("user", "admin").default("user").messages({
      "any.only": "Role must be either 'user' or 'admin'",
    }),
  }),
};

// login schema 
export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),

    password: Joi.string().min(6).max(50).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password must be at most 50 characters",
    }),
  })
};

// forget password schema
export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
  })
}

// reset password schema
export const resetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),

    otp: Joi.string().length(4).required().messages({
      "string.length": "OTP must be 4 digits",
      "string.empty": "OTP is required",
    }),

    password: Joi.string().min(6).max(50).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
      .messages({
        "string.min": "Password must be at least 6 characters",
        "string.max": "Password must be at most 50 characters",
        "string.empty": "Password is required",
      }),

    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
      "string.empty": "Confirm Password is required",
    }),
  })
}
