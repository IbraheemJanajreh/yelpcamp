const baseJoi = require('joi');
const sanitizeHtml=require('sanitize-html');
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must noy include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowAttributes: {},
                });
                if (clean !== value)
                    return helpers.error('string.escapeHTML', {
                        value
                    });
                return clean;
            }
        }
    }
});
const Joi = baseJoi.extend(extension);
module.exports.campgroundSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    //image: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    deleteImages: Joi.array(),
});
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required().escapeHTML()
    }).required()
});