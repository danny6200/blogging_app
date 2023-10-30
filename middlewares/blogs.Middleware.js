const Joi = require("joi");

const ValidateBlogCreation = async (req, res, next) => {
    try {
        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().optional().allow(""),
            tags: Joi.string().optional().allow(""),
            body: Joi.string().required()
        })
    
        const valid = await schema.validateAsync(req.body, { abortEarly: true })

        next()
        
    } catch (error) {
        return res.status(422).send({
            message: error.message
        })
    }
}


const ValidateUpdateDetails = async (req, res, next) => {
    try {
        const schema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().optional().allow(""),
            tags: Joi.array().items(Joi.string()).optional().allow(""),
            body: Joi.string().required(),
            state: Joi.string().valid(['draft', 'published'])
        })
    
        const valid = await schema.validateAsync(req.body, { abortEarly: true })

        next()
        
    } catch (error) {
        return res.status(422).send({
            message: error.message
        })
    }
}

module.exports = {
    ValidateBlogCreation,
    ValidateUpdateDetails
}