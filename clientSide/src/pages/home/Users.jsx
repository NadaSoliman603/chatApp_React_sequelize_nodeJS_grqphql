
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
                            src={user.imageUrl}
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