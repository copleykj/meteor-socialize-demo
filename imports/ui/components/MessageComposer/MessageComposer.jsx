import React from 'react';
import { Button } from 'react-bootstrap';

const sendMessage = (ta, conversation) => {
    if (ta.value) {
        conversation.sendMessage(ta.value);
        ta.value = ''; // eslint-disable-line
    }
};

const MessageComposer = (conversation, scrollView) => {
    let ta;
    return (
        <div id="message-composer">
            <div>
                <textarea
                    ref={(ref) => { ta = ref; }}
                    onFocus={() => scrollView.scrollToBottom()}
                    onKeyPress={(event) => {
                        if (event.shiftKey && event.which === 13) {
                            event.preventDefault();
                            sendMessage(ta, conversation);
                        }
                    }}
                    className="form-control"
                />
            </div>
            <div>
                <Button
                    bsStyle="primary"
                    onClick={() => {
                        sendMessage(ta, conversation);
                    }}
                >
                    Send
                </Button>
            </div>
        </div>
    );
};

export default MessageComposer;
