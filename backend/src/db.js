import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({
    path:"./.env.db"
})
try{
    mongoose.connection.on('connected',()=>console.log('DB Connected'))
    mongoose.connection.on('disconnected',()=>console.log('DB Disconnected'))
    await mongoose.connect(process.env.DB_URI)
}
catch(err){
    console.log(err)
}

const OTP = new mongoose.Schema({
    OTP:{
        type:Number,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Expires:{
        type:Date,
        default:Date.now,
        expires:240
    }
})
const User = new mongoose.Schema({
    Email:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    
})
const otp = mongoose.model.otpStore || mongoose.model('otpStore',OTP)
export const user = mongoose.model.userDetail || mongoose.model('userDetail',User)
 export default otp 