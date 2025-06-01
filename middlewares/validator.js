import Joi from "joi";

export const signupSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email({
        tlds: { allow: ['com', 'net', 'org'] },
    }).required(),
    password: Joi.string().min(8).max(128).required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)")).messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
        'string.min': 'Password must be at least 8 characters long.'
    }),
}) 
