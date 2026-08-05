import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({
    path:"./.env.jwt"
})
console.log(process.env.PRIVATE)
export function Sign (email,objectID) {
    const payload = {email,objectID}
    const data = jwt.sign(payload,process.env.PRIVATE)
    return data
}
export async function Verify (token) {
    return jwt.verify(token,process.env.PRIVATE)
}