
import { useState } from 'react';
import { Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap'
const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎']

function ReactButton() {
    // const [showPopover, setShowPopover] = useState(true)

    return (
        <OverlayTrigger
        trigger="click"
        placement="top"
        show={true}
        // onToggle={setShowPopover}
        transition={false}
        rootClose
        overlay={
          <Popover className="rounded-pill">
            <Popover.Content className="d-flex px-0 py-1 align-items-center react-button-popover">
              {reactions.map((reaction) => (
                <Button
                  variant="link"
                  className="react-icon-button"
                  key={reaction}
                  onClick={() =>{}}
                >
                  {reaction}
                </Button>
              ))}
            </Popover.Content>
          </Popover>
        }
      >
        <Button variant="link" className="px-2">
          <i className="far fa-smile"></i>
        </Button>
      </OverlayTrigger>
    );
}

export default ReactButton;
