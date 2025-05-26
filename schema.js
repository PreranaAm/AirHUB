const Joi = require('joi');
const review = require('./models/reviews');

module.exports.listschema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required(),
        location:Joi.string().required(),


        country:Joi.string().required(),
        reviews: Joi.array()
    }).required()
    })
    module.exports.reviewschema = Joi.object({
        review:Joi.object({
            rating:Joi.number().min(1).max(5).required(),
            comment:Joi.string().required(),
            
        }).required()
        })