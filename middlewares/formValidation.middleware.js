import Joi from 'joi'

export const createUserValidation = (req, res, next) => {
    const schema = Joi.object({
        fname: Joi.string().max(20).required().alphanum(),
        lname: Joi.string().max(20).required().alphanum(),
        email: Joi.string().max(50).email({ minDomainSegments: 2 }).required(),
        password: Joi.string().min(7).required(),
        phone: Joi.string().max(15),
        address: Joi.string().max(100),
        gender: Joi.string().max(7),
        dob:Joi.string().max(20),
        
    })
    const value = schema.validate(req.body);
    if (value.error) {
        return res.json({
            status: "error",
            message: value.error.message,
        })
    }
    next();
}


export const UserEmailValidation = (req, res, next) => {

    const schema = Joi.object({
        email: Joi.string().max(50).email({ minDomainSegments: 2 }).required(),
        pin: Joi.string().min(6).required(),           
    })
    const value = schema.validate(req.body);
    if (value.error) {
        return res.json({
            status: "error",
            message: value.error.message,
        })
    }
    next();
    
}