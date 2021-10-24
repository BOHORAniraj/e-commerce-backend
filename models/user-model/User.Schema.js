import mongoose from 'mongoose'
const UserSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true,
        default:""
    },
    lname: {
        type: String,
        required: true,
        default:""
    },
    dob: {
        type: Date       
    },
    email: {
        type: String,
        required: true,
        default: "",
        max: 50,
        unique: true,
        index:1
        
    },
    isEmailConfirmed: {
        type: Boolean,
        required: true,
      default:"false",
    },
    phone: {
        type: String,
        required: true,
        default: "",
        max:20
    },
    password: {
        type: String,
        required: true,
        default: "",
        max: 20,
        min:8
    },
    address: {
        type: String,
        default: "",
        max: 100
    },
    gender: {
        type:String,
    },
    role: {
        type: String,
        required: true,
        default:"user"

    },
},
    {
        timestamps: true,
    }
)
const user = mongoose.model("User", UserSchema);
export default user;