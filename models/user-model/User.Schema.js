import mongoose from 'mongoose'
const UserSchema = mongoose.Schema({
    fname: {
        type: String,
        require: true,
        default:""
    },
    lname: {
        type: String,
        require: true,
        default:""
    },
    dob: {
        type: Date       
    },
    email: {
        type: String,
        require: true,
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
        require: true,
        default: "",
        max:20
    },
    password: {
        type: String,
        require: true,
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
        require: true,
        default:"user"

    },
},
    {
        timestamps: true,
    }
)
const User = mongoose.model("user", UserSchema);
export default User;