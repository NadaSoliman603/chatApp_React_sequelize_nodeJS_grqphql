
// const { PubSub }  = require('graphql-subscriptions' ) 
// const jwt = require('jsonwebtoken')
// const { JWT_SECRET } = require('../config/env.json')

// // module.exports = (context) => {
// //   if (context.req && context.req.headers.authorization) {
// //     const token = context.req.headers.authorization.split('Bearer ')[1]
// //     jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
// //         console.log("decodedToken" , decodedToken)
// //       context.user = decodedToken
// //     })
// //   }

// //   return context
// // }



// const pubsub = new PubSub()

// module.exports = (context) => {
//   let token
//   if (context.req && context.req.headers.authorization) {
//     console.log("CCONTEXT_REQ")
//     token = context.req.headers.authorization.split('Bearer ')[1]
//   } else if (context.connection && context.connection.context.Authorization) {
//     console.log("CCONTEXT== SUB" )
//     token = context.connection.context.Authorization.split('Bearer ')[1]
//   }

//   if (token) {
//     console.log("TOKEN_VERIFY" )
//     jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
//       context.user = decodedToken
//     })
//   }

//   context.pubsub = pubsub

//   return context
// }


const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env.json')
const { PubSub } = require('apollo-server')

const pubsub = new PubSub()

module.exports = (context) => {
  let token

  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split('Bearer ')[1]
    console.log("token req =====>" ,  token)
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split('Bearer ')[1]
    console.log("token conection====>" ,  token)
  }
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      context.user = decodedToken
    })
  }

  context.pubsub = pubsub

  return context
}