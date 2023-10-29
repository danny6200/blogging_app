const Joi = require("joi")

const ValidateUserCreation = async (req, res, next) => {
    try {
        const schema = Joi.object({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    
        const valid = await schema.validateAsync(req.body, { abortEarly: true })

        next()
        
    } catch (error) {
        return res.status(422).send({
            message: error.message
        })
    }

}

const LoginValidation = async (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        })

        const valid = await schema.validateAsync(req.body, { abortEarly: true});

        next();

    } catch (error) {
        return res.status(422).send({
            message: error.message
        })
    }
}

module.exports = { 
    ValidateUserCreation, 
    LoginValidation
}