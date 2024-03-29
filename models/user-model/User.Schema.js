import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema(
	{
		status: {
			type: String,
			required: true,
			default: "inactive",
		},
		fname: {
			type: String,
			required: true,
			default: "",
			max: 20,
		},
		lname: {
			type: String,
			required: true,
			default: "",
			max: 20,
		},
		dob: {
			type: Date,
		},
		email: {
			type: String,
			required: true,
			default: "",
			max: 50,
			unique: true,
			index: 1,
		},
		isEmailConfirmed: {
			type: Boolean,
			required: true,
			default: false,
		},
		password: {
			type: String,
			required: true,
			default: "",
			min: 8,
		},
		phone: {
			type: String,
			max: 15,
		},
		address: {
			type: String,
			max: 100,
		},
		gender: {
			type: String,
		},
		role: {
			type: String,
			required: true,
			default: "user",
		},
		refreshJWT: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

const user = mongoose.model("User", UserSchema);

export default user;
