// Validation
const Joi = require('@hapi/joi');

// Sign-up validation
const signUpValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(4).required(),
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data);
}

const loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(4).required(),
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data);
}

module.exports.signUpValidation = signUpValidation;
module.exports.loginValidation = loginValidation;