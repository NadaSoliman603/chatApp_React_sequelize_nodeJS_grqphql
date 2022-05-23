import { gql, useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { Image } from "react-bootstrap";
import { useMessageDispatch, useMessageState } from "../../context/messages";


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
  const {users} = useMessageState()
  const dispatch = useMessageDispatch()
  const selectedUser = users?.find((u) => u.selected === true)

    const [
        getMessages,
        { loading: messagesLoading, data: messagesData },
    ] = useLazyQuery(GET_MESSAGES)



    useEffect(() => {
        if (selectedUser) {
          console.log("SELECTED_USER",selectedUser.username)
          
          getMessages({ variables: { from: selectedUser.username } })
        }
      }, [selectedUser])

    return (
    <div>
         {messagesData && messagesData.getMessages.length > 0 ? (
            messagesData.getMessages.map((message) => (
              <p key={message.uuid}>{message.content}</p>
            ))
          ) : (
            <p>No Messages</p>
          )}
    </div>
    );
}

export default Messages;