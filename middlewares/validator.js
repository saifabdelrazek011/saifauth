import Joi from "joi";

export const emailSchema = Joi.string().email({
    tlds: { allow: ['com', 'net', 'org'] },
}).required()

export const passwordSchema = Joi.string().min(8).max(128).required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>])[a-zA-Z\\d!@#$%^&*(),.?\":{}|<>]{8,}$")).messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    'string.min': 'Password must be at least 8 characters long.'
})


export const signupSchema = Joi.object({
    firstName: Joi.string().required().trim().messages({
        'string.empty': 'First name is required.',
        'any.required': 'First name is required.',
    }),
    lastName: Joi.string(),
    email: emailSchema,
    password: passwordSchema,
})


export const signinSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
})

export const acceptCodeSchema = Joi.object({
    email: emailSchema,
    providedCode: Joi.string().required(),
})

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: passwordSchema
})

export const changeForgetedPasswordSchema = Joi.object({
    email: emailSchema,
    providedCode: Joi.string().required(),
    newPassword: passwordSchema,
})