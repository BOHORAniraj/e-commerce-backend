import UserSchema from "./User.Schema.js"
export const createUser = newUser => {
    try {
        const result = UserSchema(newUser).save();
        return result;
    } catch (error) {
        throw new Error(error);
        
    }
};