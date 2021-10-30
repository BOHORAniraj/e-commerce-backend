import express from 'express'
const Router = express.Router();

import { createUser, verifyEmail } from '../models/user-model/User.model.js'
import { createUserValidation , UserEmailVerificationValidation} from '../middlewares/formValidation.middleware.js'
import { hashPassword } from '../helpers/bcrypt.helper.js'
import { createUniqueEmailConfirmation,findUserEmailVerification ,deleteInfo } from '../models/session/Session.model.js'
import {sendEmailVerificationConfirmation,sendEmailVerificationLink} from '../helpers/email.helper.js'

Router.all("/", (req, res, next) => {
	next();
});

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
export default Router;
