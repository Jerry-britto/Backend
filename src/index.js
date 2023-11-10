// require('dotenv').config({path:"./env"})
import dotenv from 'dotenv'
import connectToDB from "./db/index.js";
import { app } from './app.js';
dotenv.config({
    path:'./env'
})


const PORT = process.env.PORT || 3000
connectToDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is listening on ${PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGODB connection error failed!!",err)
    app.on("error",(error)=>{ //this is done to ensure whether our express app is able to respond to db or not
        console.log("Not able to connect with db");
        throw error
    })
})


/*
import mongoose from "mongoose";
import  {DB_NAME} from './constants'
import express from "express";
const app = express()
;(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error",(error)=>{ //this is done to ensure whether our express app is able to respond to db or not
            console.log("Not able to connect with db");
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    }
    catch(error){
        console.error("Error: ",error)
    }
})()
*/