const Joi = require("joi");

const validateSignup = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const validateLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    validateSignup,
    validateLogin
};