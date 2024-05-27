const Joi = require("joi");

const createEvent = Joi.object({
    name: Joi.string().min(3).required(),
    date: Joi.date().required(),
    time: Joi.string()
});

const updateEvent = Joi.object({
    name: Joi.string().min(3),
    date: Joi.date(),
    time: Joi.string()
})

module.exports = {
    createEvent,
    updateEvent
};