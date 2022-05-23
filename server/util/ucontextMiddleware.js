
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env.json')

module.exports = (context) => {
  if (context.req && context.req.headers.authorization) {

    const token = context.req.headers.authorization.split('Bearer ')[1]
    console.log(token)
    console.log("token" , token)
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        console.log("decodedToken" , decodedToken)
      context.user = decodedToken
    })
  }

  return context
}

// "token  yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFobWFkIiwiaWF0IjoxNjUzMTkwNzkxLCJleHAiOjE2NTMxOTQzOTF9.iUk8bAga7Mc5xBjpXE9e9y81Ue6SfQHwki35PgH6vfo,"
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFobWFkIiwiaWF0IjoxNjUzMTkxMTg0LCJleHAiOjE2NTMxOTQ3ODR9.zdaubkLdjwH5g4BS78wlxu9oZ2iqp28ksfG7IVuPtbU"