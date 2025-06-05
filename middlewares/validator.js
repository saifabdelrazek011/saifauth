import Joi from "joi";
import { SURE_MESSAGE } from "../config/env.js";

export const emailSchema = Joi.string().email().required()

export const passwordSchema = Joi.string().min(8).max(128).required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z\\d!@#$%^&*(),.?\":{}|<>]{8,}$")).messages({
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
7

export const signinSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
})

export const deleteAccountSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
    sureMessage: Joi.string().required().valid(SURE_MESSAGE).trim().messages({
        'string.empty': 'Sure message is required.',
        'any.required': 'Sure message is required.',
    })

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

export const createPostSchema = Joi.object({
    title: Joi.string().required().trim().messages({
        'string.empty': 'Title is required.',
        'any.required': 'Title is required.',
    }),
    description: Joi.string().min(50).required().trim().messages({
        'string.empty': 'Description is required.',
        'any.required': 'Description is required.',
        'string.min': 'Description must be at least 50 characters long.'
    }),
    userId: Joi.string().required().trim().messages({
        'string.empty': 'User ID is required.',
        'any.required': 'User ID is required.',
    })
})

export const updateUserInfoSchema = Joi.object({
    firstName: Joi.string().required().trim().messages({
        'string.empty': 'First name is required.',
        'any.required': 'First name is required.',
    }),
    lastName: Joi.string(),
    email: emailSchema
}
)