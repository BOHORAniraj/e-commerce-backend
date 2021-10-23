import express from 'express'
const Router = express.Router();

import { createUser, verifyEmail } from '../models/user-model/User.model.js'
import { createUserValidation , UserEmailValidation} from '../middlewares/formValidation.middleware.js'
import { hashPassword } from '../helpers/bcrypt.helper.js'
import { createUniqueEmailConfirmation,findUserEmailVerification ,deleteInfo } from '../models/session/Session.model.js'
import {emailProcessor} from '../helpers/email.helper.js'

Router.all("/", (req, res, next) => {
    console.log("from user router");
    next();

})

Router.post("/",createUserValidation, async (req, res) => {
    
    try {
        const hashPass = hashPassword(req.body.password);
        if (hashPass) {
            
    
            req.body.password = hashPass

            console.log(hashPass);

            const {_id,fname,email} = await createUser(req.body)
            if (_id) {

                const {pin} = await createUniqueEmailConfirmation(email);

               

                if (pin) {
                    const forSendingEmail = {
                        fname,
                        email,
                        pin,
                    }
                    emailProcessor(forSendingEmail);
                }


                return res.json({
                    state: 'success',
                    message: "New User has been created successfully",
                })
            }
        }
        res.json({
            state: "error",
            message: " unable to create new user",
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            state: "error",
            message:"Error,unable to create new user",

        })
        
    }
})


Router.patch("/email-verification", UserEmailValidation, async (req, res) => {
    try {
        const result = await findUserEmailVerification(req.body);

        if (result?._id) {
            const data = await verifyEmail(result.email)
            if (data?._id) {
                deleteInfo(req.body);
                sendEma
                
            }
        }
        res.json({
            status: "error",
            message: "Unable to verify email , eitther your link is invalid or expired"
        })
    } catch (error) {
        res.json({
            status: "error",
            message:"error, unable to verify email, please try again later",
        })
        
    }
})


export default Router;
