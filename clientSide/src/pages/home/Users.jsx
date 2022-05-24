
import { gql, useQuery } from '@apollo/client';
import { Image } from 'react-bootstrap';
import { useMessageDispatch, useMessageState } from '../../context/messages'

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


function Users() {
    const dispatch = useMessageDispatch()
    const { users } = useMessageState()
    const { loading } = useQuery(GET_USERS, {
        onCompleted: (data) => dispatch({ type: 'SET_USERS', payload: data.getUsers }),
        onError: (err) => console.log(err),
    })


    const selectedUser = users?.find((u) => u.selected === true)?.username


    if (!users || loading) {
        return <p>Loading..</p>
    } else if (users?.length === 0) {
        return <p>No users have joined yet</p>
    } else if (users?.length > 0) {
        return (
            users.map((user) => {
                const selected = selectedUser === user.username ? "bg-white":""
                return (
                    <div
                        className={`d-flex p-2 mb-3 mt-3 user-div ${selected}`}
                        key={user.username} 
                        onClick={() => {
                            dispatch({
                                type: "SET_SELECTED_USER",
                                payload: user.username
                            })
                        }}
                    >
                        <Image
                            src={user.imageUrl ?user.imageUrl : "data:image/jpeg;base64,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"}
                            roundedCircle
                            className="mr-2"
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                        <div>
                            <p className="text-success">{user.username}</p>
                            <p className="font-weight-light">
                                {user.latestMessage
                                    ? user.latestMessage.content
                                    : 'You are now connected!'}
                            </p>
                        </div>
                    </div>
                )
            })
        )
    }

}

export default Users;