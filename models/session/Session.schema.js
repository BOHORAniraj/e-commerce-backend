import mongoose from 'mongoose'
const SessionSchema = mongoose.Schema(
    {
        pin: {
            type: String,
            require: true,
        },

    
    email: {
        type: String,
        require: true,
        max: 50,
              
        },
        type: {
            type: String,
            default: "emailValidation",
            max:50,
    }
    
},
    {
        timestamps: true,
    }
)
const session = mongoose.model("Session", SessionSchema);
export default session;