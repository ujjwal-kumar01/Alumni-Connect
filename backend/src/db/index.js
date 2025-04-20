import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connecting_db = async () => {
    try {
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Connected to MongoDB !! DB host:",connectionInstance.connection.host)

    } catch (error) {
        console.log("Error connecting to MongoDB", error)
        process.exit(1)
    }
}

export default connecting_db;