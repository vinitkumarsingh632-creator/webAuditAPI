import express from 'express'
import otp from './src/db.js'
import transporter from './src/mail.js'
import template from './src/emailTemplate.js'
import dotenv from 'dotenv'

import cors from 'cors'
import {user} from './src/db.js'
import rateLimit from 'express-rate-limit'
dotenv.config({
    path:'.env.server'
})
dotenv.config({
    path:'./.env.mail'
})
console.log(process.env.APP_PASSWORD)
const app = express()
const rateLimiter = rateLimit({
    windowMs:15*1000,
    limit:5
})

app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))
app.use(rateLimiter)
app.use(express.json())
app.post('/',async(req,res)=>{
    const otp = Math.floor(100000 + Math.random() * 900000);
    try{
        await transporter.sendMail({
        from:process.env.EMAIL,
        subject:`Verify Your Email - WebOrbit`,
        to:req.body.email,
        html:template.replace('{{OTP}}',otp)
    })
    
    }
    catch(err){
        console.log(err)
    }
    try{
        await otp.create({
        Email:req.body.email,
         OTP:otp
    })
    }
    catch(err){
        console.log(err)
    }
    console.log(req.body.otp)
    console.log(req.body.email)
     res.setHeader('Content-Type','application/json')
    res.send(JSON.stringify({
        status:true
    }))
})
app.post('/otp',async(req,res)=>{
   const data = await otp.find({
        Email:req.body.email
    })
    if(data.OTP == req.body.otp){
        try{
            const objectID = await user.create({
                Email:req.body.email
            })
        }
        catch(err){
            console.log(err)
            process.exit(1)
        }
    }
    console.log(data)
})
app.get('/',(req,res)=>{
    res.send('GET')
})

app.listen(process.env.PORT,()=>{
    console.log('Server Started')
})