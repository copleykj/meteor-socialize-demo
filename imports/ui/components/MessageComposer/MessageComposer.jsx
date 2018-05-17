import { Button } from 'react-bootstrap';
import { Conversation } from 'meteor/socialize:messaging';
import { User } from 'meteor/socialize:user-model';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import ComposerTextArea from '../ComposerTextArea/ComposerTextArea.jsx';

class MessageComposer extends Component {
    sendMessage = () => {
        const { conversation, participants, onSend } = this.props;
        const { value } = this.composer.textarea;
        if (value) {
            if (conversation) {
                conversation.sendMessage(value);
            } else if (participants.length > 0) {
                const convo = new Conversation().save();
                convo.addParticipants(participants);
                convo.sendMessage(value);
                browserHistory.push(`/messages/${convo._id}`);
            }
            onSend && onSend();
            this.composer.reset();
        }
    }
    render() {
        const { onFocus, onBlur, disabled } = this.props;
        return (
            <div id="message-composer">
                <ComposerTextArea
                    rows="1"
                    getRef={(composer) => { this.composer = composer; }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onSend={this.sendMessage}
                    disabled={disabled}
                />
                <Button
                    bsStyle="primary"
                    onClick={this.sendMessage}
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
