import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Fragment, useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";
import { useMessageDispatch, useMessageState } from "../../context/messages";
import Message from "./Message";


const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      uuid
      from
      to
      content
      createdAt
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

function Messages() {
  const { users } = useMessageState()
  const dispatch = useMessageDispatch()
  const selectedUser = users?.find((u) => u.selected === true)
  const [content,setContent] = useState("")

  
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  })


const submitMessage = (e)=>{
  e.preventDefault()
  if (content.trim() === '' || !selectedUser) return
  setContent('')
  sendMessage({ variables: { to: selectedUser.username, content } })

}
  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES)


  useEffect(() => {
    if (messagesData) {
      console.log('SET_USER_MESSAGES')
      dispatch({
        type: 'SET_USER_MESSAGES',
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      })
    }
  }, [messagesData])


  useEffect(() => {
    if (selectedUser) {
      console.log("SELECTED_USER", selectedUser.username)
      getMessages({ variables: { from: selectedUser.username } })
      
    }
  }, [selectedUser])

 
  let messages  = []
  if(messagesData && messagesData.getMessages.length > 0){
    messages =  Object.keys(messagesData.getMessages).sort().reverse().map(key=> ({
    ...messagesData.getMessages[key]
   }) );
  }

 

  return (
    <div>
      {messagesData && messagesData.getMessages.length > 0 ? (
        messages.map((message, index) =>{
          return (
            <Fragment key={message.uuid}>
              <Message message={message} />
              {index === messagesData.length - 1 && (
                <div className="invisible">
                  <hr className="m-0" />
                </div>
              )}
            </Fragment>
  
          )
        }
        )
      ) : (
        <p className="info-text small" >
        You are now connected! send your first message!
      </p>
      )}
      <Form>
        <Form.Group className="d-flex align-items-center">
            <Form.Control
              type="text"
              className="message-input rounded-pill p-2  bg-sendMSG_input border-0"
              placeholder="Type a message.."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <i
              style={{marginLeft: "10px"}}
              className="fas fa-paper-plane fa-2x text-primary ml-2 pl-3"
              onClick={submitMessage}
              role="button"
            ></i>
          </Form.Group>
        </Form>
    </div>
  );
}

export default Messages;