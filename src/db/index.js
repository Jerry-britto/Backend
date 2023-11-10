import mongoose from "mongoose";
import {DB_NAME} from '../constants.js'

const connectToDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MONGODB connected !! DB HOST: ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.log(`MONGO DB CONNECTION ERROR `,error)
        process.exit(1) //to exit the application (node js)
    }
}

export default connectToDB