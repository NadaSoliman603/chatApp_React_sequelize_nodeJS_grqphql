import React from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap'

import { useAuthState } from '../../context/auth'
import { gql, useMutation } from '@apollo/client';
import ReactButton from './ReactButton'
import { useState } from 'react';
const REACT_TO_MESSAGE = gql`
  mutation reactToMessage($uuid: String!, $content: String!) {
    reactToMessage(uuid: $uuid, content: $content) {
      uuid
    }
  }
`
export default function Message({ message }) {
  const { user } = useAuthState()
  const sent = message.from === user.username
  const received = !sent
  const [showPopover, setShowPopover] = useState(false)
  const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => setShowPopover(false),
  })

  const reactionIcons =message?.reactions ? [...new Set(message?.reactions.map((r) => r.content))] :[]


  const react = (reaction) => {
    reactToMessage({ variables: { uuid: message.uuid, content: reaction } })
  }

  const reactButton = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={showPopover}
      onToggle={setShowPopover}
      transition={false}
      rootClose
      overlay={
        <Popover className="rounded-pill">
          <Popover.Body className="d-flex px-0 py-1 align-items-center react-button-popover">
            {reactions.map((reaction) => (
              <Button
                variant="link"
                className="react-icon-button"
                key={reaction}
                onClick={() => react(reaction)}
              >
                {reaction}
              </Button>
            ))}
          </Popover.Body>
        </Popover>
      }
    >
      <Button variant="link" className="px-2">
        <i className="far fa-smile"></i>
      </Button>
    </OverlayTrigger>
  )


  return (
    <OverlayTrigger
      placement={sent ? 'right' : 'left'}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format('MMMM DD, YYYY @ h:mm a')}
        </Tooltip>
      }
      transition={false}
    >
      <div
        style={{flexDirection:sent? "row-reverse" :"row"}}
        className={classNames('d-flex mt-3  mb-5', )}
      >

        <div
          className={classNames('py-2 px-3 rounded-pill  position-relative', {
            'bg-primary': sent,
            'bg-recieveMSG': received,
          })}
        >
          {message.reactions.length > 0 && (
            <div className="reactions-div bg-secondary p-1 rounded-pill">
              {reactionIcons} {message.reactions.length}
            </div>
          )}
          <p className={classNames({ 'text-white': sent })} key={message.uuid}>
            {message.content}
          </p>
          
        </div>
          {reactButton}
      </div>
    </OverlayTrigger>
  )
}