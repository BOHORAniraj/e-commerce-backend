import express from "express";
const Router = express.Router();
import {getUserByEmail, getUserByEmailAndRefreshToken} from "../models/user-model/User.model.js";
import { verifyRefreshJWT, createAccessJWT } from "../helpers/jwt.helper.js";
import { createOTP } from "../models/rest-pin/Pin.model.js";
import { sendPasswordResetOTP } from "../helpers/email.helper.js";

Router.all("/", (req, res, next) => {
	console.log("token got hit");

	next();
});

Router.get("/", async (req, res) => {
	try {
		const { authorization } = req.headers;

		const { email } = verifyRefreshJWT(authorization);

		if (email) {
			const filter = {
				email,
				refreshJWT: authorization,
			};
			const user = await getUserByEmailAndRefreshToken(filter);
			if (user?._id) {
				const accessJWT = await createAccessJWT({ _id: user._id, email });

				return res.json({
					accessJWT,
				});
			}
		}

		res.status(401).json({
			status: "error",
			message: "Unauthenticated",
		});
	} catch (error) {
		console.log(error);
		res.status(401).json({
			status: "error",
			message: "Unauthenticated",
		});
	}
});

Router.post("/request-otp", async (req, res) => {
	try {
		// getting email 
		const { email } = req.body;

		//getting user by email

		if (email) {
			const user = await getUserByEmail(email);

			if (user?._id) {
				//create otp and store in the token along with user id

				const result = await createOTP({
					email,
					type:"passwordResetOTP"
				})
				if (!result?._id) {
					return res.json({
						status: "error",
						message:"please try again later",
					})
				}
				//send email with otp
				const emailObj = {
					email,
					otp: result.pin,
					fname:user.fname,
				}
				sendPasswordResetOTP(emailObj)
			}
		}
		res.json({
			status: "success",
			message:"if the email is exist in our system, we will send you an otp"
		})

	} catch (error) {
		console.log(error);
		res.json({
			status: "error",
			message:"error, unable to process your request"
		})
		
	}
})
export default Router;
