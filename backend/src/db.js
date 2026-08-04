import mongoose from "mongoose";

try{
    mongoose.connection.on('connected',()=>console.log('DB Connected'))
    mongoose.connection.on('disconnected',()=>console.log('DB Disconnected'))
    await mongoose.connect('mongodb+srv://vinitkumarsingh632_db_user:abhaysingh@restro.6kboufv.mongodb.net/otp?retryWrites=true&w=majority')
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
const user = mongoose.model.userDetail || mongoose.model('userDetail',User)
 export default otp 