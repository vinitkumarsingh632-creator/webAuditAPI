import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({
    path:"./.env.jwtt"
})
async function Sign (email) {
    const payload = {email}
    const data = await jwt.sign(payload,process.env.PRIVATE)
    return data
}