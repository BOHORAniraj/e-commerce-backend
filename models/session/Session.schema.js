import mongoose from "mongoose";

const SessionSchema = mongoose.Schema(
	{
		
		email: {
			type: String,
			required: true,
			default:"accessJWT",
			max: 50,
		},
		token: {
			type: String,
			required:true,
			default: null,
			max: 50,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const session = mongoose.model("Session", SessionSchema);

export default session;
