import express from 'express'
const Router = express.Router();

import { createUser } from '../models/user-model/User.model.js'
import { createUserValidation } from '../middlewares/formValidation.middleware.js'
import {hashPassword} from '../helpers/bcrypt.helper.js'

Router.all("/", (req, res, next) => {
    console.log("from user router");
    next();

})

Router.post("/",createUserValidation, async (req, res) => {
    console.log(req.body)
    try {
        const hashPass = hashPassword(req.body.password);
        if (hashPass) {
            
    
            req.body.password = hashPass

            console.log(hashPass);

            const result = await createUser(req.body)
            if (result?._id) {
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
export default Router;
