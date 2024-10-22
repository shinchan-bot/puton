import { Request, Response, NextFunction } from "express";
import Joi from 'joi';

const VerifyOtpSchema = Joi.object({
    phone_number: Joi.string()
        .required()
        .messages({
            'any.required': 'Mobile number is required',
            'string.empty': 'Mobile number is required',
            'string.base': 'Invalid mobile number format',
        })
        .pattern(/^[0-9]{10,15}$/)
        .messages({
            'string.pattern.base': 'Invalid mobile number format',
        }),

    otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'any.required': 'Code is required',
            'string.length': 'Code must be exactly 6 digits long',
            'string.pattern.base': 'Code must be a numeric value',
        }),

    user_type: Joi.string().required().messages({
        'any.required': 'User type is required'
    })
});


export const validateVerifyOtp = (req: Request, res: Response, next: NextFunction) => {
    const { error } = VerifyOtpSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    next();
};
// To validate in your controller
// const { error } = validateVerifyOtp.validate(req.body);
