import React, { Fragment, useEffect, useState } from 'react'
import { Row, Col, Button, Image, Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { gql, useLazyQuery, useQuery } from '@apollo/client'

import { useAuthDispatch } from '../../context/auth'
import { Container } from 'react-bootstrap';
import Header from './Header'
import Messages from './Messages'
import Users from './Users'

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt
      imageUrl
      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`



const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`

export default function Home({ history }) {
  const [selectedUser, setSelectedUser] = useState(null)


  return (
    <Fragment>
      
      <Row className="bg-white">
      <Header />
        <Col xs={4} style={{ backgroundColor: "#eee" }}>
          <Users setSelectedUser={setSelectedUser}/>
          </Col>
        <Col xs={10} md={8}  className="messages-box d-flex flex-column-reverse">
          <Messages selectedUser={selectedUser}/>
        </Col>
      </Row>
    </Fragment>
  )
}