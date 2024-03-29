import mongoose from 'mongoose'

const mongoClient = async () => {
    try {
        if (!process.env.MONGO_CLIENT) {
            console.log("MONGO_CLIENT is not defined , please create MONGO_CLIENT and provide a mongodb connection string")
        }
        const con = await mongoose.connect(process.env.MONGO_CLIENT);
        if (con) {
           return console.log("mongoDB connected");
        }
    console.log("fail to connect mongoDB")
    } catch (error) {
        console.log(error)
    }
}
export default mongoClient;