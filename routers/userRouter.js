import express from 'express'
const Router = express.Router();

import { createUser, getUserByEmail, verifyEmail,removeRefreshJWT, updateUserP } from '../models/user-model/User.model.js'
import { createUserValidation , loginUserFormValidation, UserEmailVerificationValidation,passUpdateFormValidation} from '../middlewares/formValidation.middleware.js'
import { comparePassword, hashPassword } from '../helpers/bcrypt.helper.js'
import { createUniqueEmailConfirmation,findUserEmailVerification ,deleteInfo } from '../models/rest-pin/Pin.model.js'
import { sendEmailVerificationConfirmation, sendEmailVerificationLink, sendPasswordUpdateNotification } from '../helpers/email.helper.js'
import { getJWTs } from "../helpers/jwt.helper.js"
import {removeSession} from "../models/session/Session.model.js"
import { UserAuth } from '../middlewares/authValidation.middleware.js';

Router.all("/", (req, res, next) => {
	next();
});

Router.get("/",UserAuth, async (req, res) => {
	
	
	res.json({
		status: "success",
		message: "user profile",
		user:req.user,
	})
	
})
// create new user
Router.post("/", createUserValidation, async (req, res) => {
	try {
		const hashPass = hashPassword(req.body.password);

		if (hashPass) {
			req.body.password = hashPass;

			const { _id, fname, email } = await createUser(req.body);

			if (_id) {
				const { pin } = await createUniqueEmailConfirmation(email);

				if (pin) {
					const forSendingEmail = {
						fname,
						email,
						pin,
					};
					sendEmailVerificationLink(forSendingEmail);
				}

				return res.json({
					status: "success",
					message:
						"New user has been created successfully! WE have send a email confirmation to your email, please check and follow the instruction to activate your account",
				});
			}
		}
		res.json({
			status: "error",
			message: "Unable to created new user",
		});
	} catch (error) {
		let msg = "Error, Unable to created new user";
		console.log(error.message);
		if (error.message.includes("E11000 duplicate key error collection")) {
			msg = "This email has been used by another user.";
		}
		res.json({
			status: "error",
			message: msg,
		});
	}
});
// updating user
Router.patch("/", UserAuth, async(req, res) => {
	try {
		const { _id } = req.user;
		 
		
		if (_id) {
			const result = await updateUserP(_id, req.body);
			

			if (result?._id) {
				return res.json({
					status: "success",
					message:"Profile has been successfully updated",
				})
			}
		}
		return res.json({
			status: "error",
			message:"unbale to update the user, please try again later",
		})
	} catch (error) {
		console.log(error);
		return res.json({
			status: "error",
			message:"Error , unable to update profile please try again later",
		})
		
	}
})




//email verification
Router.patch(
	"/email-verification",
	UserEmailVerificationValidation,
	async (req, res) => {
		try {
			const result = await findUserEmailVerification(req.body);
			console.log(result,"userrouter")

			if(result?._id) {
				const data = await verifyEmail(result.email);
				console.log(data,"fromdatta")
				if (data?._id) {
					deleteInfo(req.body);
					sendEmailVerificationConfirmation({
						fname: data.fname,
						email: data.email,
					});
					return res.json({
						status: "success",
						message: "Your email has been verified, you may login now",
					});
				}
			}
			res.json({
				status: "error",
				message:
					"Unable to verify your email, either the link is invalid or expired",
			});
		} catch (error) {
			res.json({
				status: "error",
				message: "Error, Unable to verify the email, please try again later",
			});
		}
	}
);



//user login

Router.post("/login",loginUserFormValidation, async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await getUserByEmail(email);
		

		if (user?._id) {
		
			const isPassMatch = comparePassword(password, user.password)

			if (isPassMatch) {

				// get jwts then send to the client
				const jwts = await getJWTs({ _id: user._id, email: user.email });
				user.password = undefined;
				return	res.json({
					status: "success",
					messgae: "login success",
					jwts,
					user,
				})
			}
		
		}

		res.status(401).json({
			status: "error",
			messgae: "unauthorized",
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({
			status: "error",
			message:"Error, unbale to login now , please try again later"
			
		})
		
	}
})
Router.post("/logout", async (req, res) => {
	try {
		const { accessJWT, refreshJWT } = req.body;
		accessJWT && (await removeSession(accessJWT));
		refreshJWT && (await removeRefreshJWT(refreshJWT));

		res.json({
			status: "success",
			message: "logging out ..",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			status: "error",
			message: "Error, unable to login now, please try again later",
		});
	}
});

Router.post("/password-update", UserAuth,passUpdateFormValidation, async(req, res) => {
	try {
		const { _id, password, fname, email } = req.user;
		const { currentPassword } = req.body;

		//matching current password in db

		const passMatch = comparePassword(currentPassword, password);
		// console.log(passMatch, "passed matched")
		if (passMatch) {
			const hashedPass = hashPassword(req.body.password);
			if (hashedPass) {
				const user = await updateUserP(_id, { password: hashedPass })
				if (user._id) {
					// console.log("before changing", password);
					// console.log("after changing", user.password);
					res.json({
						status: "success",
						message:"password has been updated",
					})
					sendPasswordUpdateNotification({ fname, email })
					return;
				}
			}
		}
		res.json({
			status: "error",
			message:"Unable to update your password at the moment,please try again later"
		})

	} catch (error) {
		console.log(error)
		res.json({
			status: "error",
			message:"Error, unable to process your request to change password"
		})
		
	}
	
})




export default Router;
