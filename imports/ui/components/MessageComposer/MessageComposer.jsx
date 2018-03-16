import { Button } from 'react-bootstrap';
import { Conversation } from 'meteor/socialize:messaging';
import { User } from 'meteor/socialize:user-model';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import ComposerTextArea from '../ComposerTextArea/ComposerTextArea.jsx';

class MessageComposer extends Component {
    sendMessage = (messageText) => {
        const { conversation, participants, onSend } = this.props;
        if (messageText) {
            if (conversation) {
                conversation.sendMessage(messageText);
            } else if (participants.length > 0) {
                const convo = new Conversation().save();
                convo.addParticipants(participants);
                convo.sendMessage(messageText);
                browserHistory.push(`/messages/${convo._id}`);
            }
            onSend && onSend();
            this.ta.value = ''; // eslint-disable-line
        }
    }
    render() {
        const { onFocus, onBlur, disabled } = this.props;
        return (
            <div id="message-composer">
                <ComposerTextArea rows="1" getRef={(ref) => { this.ta = ref; }} onFocus={onFocus} onBlur={onBlur} onSend={this.sendMessage} disabled={disabled} />
                <Button
                    bsStyle="primary"
                    onClick={() => {
                        this.sendMessage(this.ta.value);
                    }}
                    disabled={disabled}
                >
                    Send
                </Button>
            </div>
        );
    }
}

MessageComposer.propTypes = {
    conversation: PropTypes.instanceOf(Conversation),
    participants: PropTypes.arrayOf(PropTypes.instanceOf(User)),
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onSend: PropTypes.func,
    disabled: PropTypes.bool,
};

export default MessageComposer;
