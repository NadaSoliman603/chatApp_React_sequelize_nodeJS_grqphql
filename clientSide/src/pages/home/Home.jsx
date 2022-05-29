import React, { Fragment, useEffect } from 'react'
import { Row, Col,} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { gql,useSubscription } from '@apollo/client'

import {  useAuthState } from '../../context/auth'
import Header from './Header'
import Messages from './Messages'
import Users from './Users'
import { useMessageDispatch } from './../../context/messages';




const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      from
      to
      content
      createdAt
    }
  }
`



export default function Home({ history }) {

  const { data: messageData, error: messageError } = useSubscription(  NEW_MESSAGE)
  const messageDispatch = useMessageDispatch()
  const { user } = useAuthState()


  
  useEffect(() => {
    if (messageError) console.log(messageError)
    if (messageData) {
      const message = messageData.newMessage
      const otherUser = user.username === message.to ? message.from : message.to
      
      console.log("message" , message  )
      console.log("otherUser" , otherUser  )
  
      messageDispatch({
        type: 'ADD_MESSAGE',
        payload: {
          username: otherUser,
          message,
        },
      })
    }
  }, [messageError, messageData])

  return (
    <Fragment>
      <Row className="bg-white">
        <Header />
        <Col className='users-box' xs={4} style={{ backgroundColor: "#eee" }}>
          <Users  />
        </Col>
        <Col xs={10} md={8} className="messages-box d-flex flex-column-reverse">
          <Messages  />
        </Col>
      </Row>
    </Fragment>
  )
}