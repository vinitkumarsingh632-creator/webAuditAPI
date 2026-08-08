import crypto from 'node:crypto'
const hash = crypto.randomBytes(4).toString('hex')
console.log(hash)