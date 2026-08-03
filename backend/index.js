import express from 'express'
import dotenv from 'dotenv'
dotenv.config({
    path:'.env.server'
})
import rateLimit from 'express-rate-limit'
const app = express()
const rateLimiter = rateLimit({
    windowMs:15*1000,
    limit:5
})
app.use(express.json())
app.options('/',(req,res)=>{
      res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','POST,GET')
    res.setHeader('Access-Control-Allow-Headers','Content-Type')
    res.send("true")
})
app.post('/',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','POST,GET')
    res.setHeader('Access-Control-Allow-Headers','Content-Type')
    console.log(req.body.otp)
    console.log(req.body.email)

    res.send(JSON.stringify({
        status:true
    }))
})
app.get('/',(req,res)=>{
    res.send('GET')
})
app.use(rateLimiter)
app.listen(process.env.PORT,()=>{
    console.log('Server Started')
})