import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connect=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`${connectionInstance}`)
        }
     catch (error) {
        console.log("MONGODB connection failed",error.message)
    }
}
export default connect;