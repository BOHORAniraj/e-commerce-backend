import Joi from 'joi'

const shortStr = Joi.string().max(20).alphanum().required();
const email = Joi.string().max(50).email({ minDomainSegments: 2 }).required();

export const createUserValidation = (req, res, next) => {
    const schema = Joi.object({
        fname: shortStr,
        lname: shortStr,
        email: email,
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


export const UserEmailVerificationValidation = (req, res, next) => {

    const schema = Joi.object({
        email: email,
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