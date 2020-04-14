const joi = require('@hapi/joi')


const signupValidation = (data) => {
    const schema = joi.object().keys({
                Name: joi.string().min(6).required(),
                MobileNo: joi.string().min(10).required(),
                Password: joi.string().min(6).required(),

            })

            return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = joi.object({
        Name: joi.string().min(6).required(),
        Password: joi.string().min(6).required(),

    })

    return schema.validate(data)
}



module.exports.signupValidation = signupValidation
module.exports.loginValidation = loginValidation