import UserSchema from "./User.Schema.js"
export const createUser = newUser => {
    try {
        const result = UserSchema(newUser).save();
        return result;
    } catch (error) {
        throw new Error(error);
        
    }
};
export const verifyEmail = email => {
    try {
        const result = UserSchema.findOne({ email });
        return result;

    } catch (error) {
        throw new Error(error);
    }
}