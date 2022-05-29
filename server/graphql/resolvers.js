const bcrypt = require('bcryptjs')
const {
  UserInputError,
  AuthenticationError,
  withFilter,
  ForbiddenError,
} = require('apollo-server')

// const { withFilter } = require('graphql-subscriptions');

const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
// const { PubSub } = require('apollo-server')

// const { PubSub } = require('graphql-subscriptions')

const { User, Message , Reaction } = require('../models')

const { JWT_SECRET } = require('../config/env.json')

// const pubsub = new PubSub();

module.exports = {
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Reaction: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    Message: async (parent) => await Message.findByPk(parent.messageId),
    User: async (parent) =>
      await User.findByPk(parent.userId, {
        attributes: ['username', 'imageUrl', 'createdAt'],
      }),
  },

  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError('Unauthenticated')
          return pubsub.asyncIterator(['NEW_MESSAGE'])
        },
        ({ newMessage }, _, { user }) => {
          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true
          }

          return false
        }
      ),
    },

    newReaction: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError('Unauthenticated')
          return pubsub.asyncIterator(['NEW_REACTION'])
        },
       async ({ newReaction }, _, { user }) => {
          
          const message = await newReaction.getMessage()
          if (message.from === user.username || message.to === user.username){
            return true
          }
          return false
        }
      ),
    },
  },
  Query: {
    getUsers: async (_, __, { user }) => {
      try {

        if (!user) throw new AuthenticationError("unAuthenticated")
        let users = await User.findAll({
          attributes: ['username', 'imageUrl', 'createdAt'],
          where: { username: { [Op.ne]: user.username } },
        })
        const allUserMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }],
          },
          order: [['createdAt', 'DESC']],
        })

        users = users.map((otherUser) => {
          const latestMessage = allUserMessages.find(
            (m) => m.from === otherUser.username || m.to === otherUser.username
          )
          otherUser.latestMessage = latestMessage
          return otherUser
        })


        return users
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    login: async (_, args) => {
      const { username, password } = args
      let errors = {}

      try {
        if (username.trim() === '')
          errors.username = 'username must not be empty'
        if (password === '') errors.password = 'password must not be empty'

        if (Object.keys(errors).length > 0) {
          throw new UserInputError('bad input', { errors })
        }

        const user = await User.findOne({
          where: { username },
        })

        if (!user) {
          errors.username = 'user not found'
          throw new UserInputError('user not found', { errors })
        }

        const correctPassword = await bcrypt.compare(password, user.password)

        if (!correctPassword) {
          errors.password = 'password is incorrect'
          throw new UserInputError('password is incorrect', { errors })
        }

        const token = jwt.sign({ username }, JWT_SECRET, {
          expiresIn: 60 * 60,
        })

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        }
      } catch (err) {
        console.log(err)
        throw err
      }
    },

    getMessages: async (parent, { from }, { user }) => {
      try {
        if (!user) throw new AuthenticationError('Unauthenticated')

        const otherUser = await User.findOne({
          where: { username: from },
        })
        if (!otherUser) throw new UserInputError('User not found')

        const usernames = [user.username, otherUser.username]

        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [['createdAt', 'DESC']],
        })

        return messages
      } catch (err) {
        console.log(err)
        throw err
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args
      let errors = {}

      try {
        // Validate input data
        if (email.trim() === '') errors.email = 'email must not be empty'
        if (username.trim() === '')
          errors.username = 'username must not be empty'
        if (password.trim() === '')
          errors.password = 'password must not be empty'
        if (confirmPassword.trim() === '')
          errors.confirmPassword = 'repeat password must not be empty'

        if (password !== confirmPassword)
          errors.confirmPassword = 'passwords must match'

        // // Check if username / email exists
        // const userByUsername = await User.findOne({ where: { username } })
        // const userByEmail = await User.findOne({ where: { email } })

        // if (userByUsername) errors.username = 'Username is taken'
        // if (userByEmail) errors.email = 'Email is taken'

        if (Object.keys(errors).length > 0) {
          throw errors
        }

        // Hash password
        password = await bcrypt.hash(password, 6)

        // Create user
        const user = await User.create({
          username,
          email,
          password,
        })

        // Return user
        return user
      } catch (err) {
        console.log(err)
        if (err.name === 'SequelizeUniqueConstraintError') {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          )
        } else if (err.name === 'SequelizeValidationError') {
          err.errors.forEach((e) => (errors[e.path] = e.message))
        }
        throw new UserInputError('Bad input', { errors })
      }
    },

    sendMessage: async (parent, { to, content }, { user, pubsub }) => {
      try {
        if (!user) throw new AuthenticationError('Unauthenticated')

        const recipient = await User.findOne({ where: { username: to } })

        if (!recipient) {
          throw new UserInputError('User not found')
        } else if (recipient.username === user.username) {
          throw new UserInputError('You cant message yourself')
        }

        if (content.trim() === '') {
          throw new UserInputError('Message is empty')
        }

        const message = await Message.create({
          from: user.username,
          to,
          content,
        })

        pubsub.publish('NEW_MESSAGE', { newMessage: message })

        return message
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    reactToMessage: async (_, { uuid, content }, { user , pubsub }) => {
      const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']
      console.log("1")
      try {
        // validate content
        if (!reactions.includes(content)) throw UserInputError("Invalid Raction")
        console.log("2")
        //get  User
        const username = user ? user.username : ''
        user = await User.findOne({ where: { username } })
        if (!user) throw new AuthenticationError('Unauthenticated')
        console.log("3")
        //GET MESSAGE
        const message = await Message.findOne({ where: { uuid } })
        if (!message) throw new UserInputError('message not found')
        console.log("4")
        //if user has permetion to react this MSG
        if (message.from !== user.username && message.to !== user.username) {
          throw ForbiddenError('Unauthorized')
        }

        console.log("5")


          let reaction = await Reaction.findOne({
          where: { messageId: message.id, userId: user.id },
        })

        if (reaction) {
          //reaction is exsist update it
          console.log("6")
          reaction.content = content
          await reaction.save()
        } else {
          // reaction dosnt exsist create it
          console.log("7")
          reaction = await Reaction.create({
            messageId: message.id,
            userId: user.id,
            content,
          })
        }

        pubsub.publish('NEW_REACTION', { newReaction: reaction })
        
        console.log("reaction" , reaction)
        return  reaction

      } catch (error) {
        console.log(error)
      }
    }
  },
}