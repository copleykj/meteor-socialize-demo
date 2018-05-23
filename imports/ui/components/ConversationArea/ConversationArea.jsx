import { withTracker } from 'meteor/react-meteor-data';
import { Conversation, Message } from 'meteor/socialize:messaging';
import { SubsCache } from 'meteor/ccorcos:subs-cache';

import { Scrollbars } from 'react-custom-scrollbars';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';

import UserAvatar from '../UserAvatar/UserAvatar.jsx';
import MessageComposer from '../../components/MessageComposer/MessageComposer.jsx';
import Markdown from '../Markdown/Markdown.jsx';
import Loader from '../../components/Loader/Loader.jsx';

const subsCache = new SubsCache(5, 20);


class MessagesContainer extends Component {
    componentDidUpdate() {
        const { currentConversation, messagesReady } = this.props;
        if (messagesReady && (currentConversation && (this.scrollDiff > -10 || this.conversationId !== currentConversation._id))) {
            this.conversationId = currentConversation._id;
            /* If scroll is close to bottom, we'll scroll to bottom as new
                messages are added */
            this.goToBottom();
        }
    }
    onScrollFrame = (values) => {
        /* figure out if the user has scrolled up so we don't try to scroll
            back down when they are trying to read previous messages */
        const { scrollTop, clientHeight, scrollHeight } = values;
        this.scrollDiff = (scrollTop + clientHeight) - scrollHeight;
    }
    onSend = () => {
        this.goToBottom();
    }
    goToBottom = () => {
        this.scrollView.scrollToBottom();
    }
    render() {
        const { messages, messagesReady, currentConversation } = this.props;

        return (
            <div id="messages-column" className={!currentConversation ? 'hidden-xs' : ''}>
                <Scrollbars
                    className="scroll-area"
                    universal
                    renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
                    onScrollFrame={this.onScrollFrame}
                    ref={(ref) => { this.scrollView = ref; }}
                >

                    <div id="messages-container">
                        <Loader ready={messagesReady} >
                            <span>
                                {messages &&
                                    messages.map((message) => {
                                        const sender = message.user();
                                        const self = sender.isSelf() && 'self';
                                        return (
                                            <div className={`message ${self}`} key={message._id}>
                                                <div>
                                                    <UserAvatar
                                                        user={sender}
                                                        size={60}
                                                    />
                                                </div>
                                                <div className="chat-bubble">
                                                    <Markdown source={message.body} />
                                                    <div className="username">
                                                        <small>
                                                            <Link to={`/profile/${sender.username}`}>{sender.displayName()}</Link> -
                                                            <small>{message.timestamp()}</small>
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </span>
                        </Loader>
                    </div>
                </Scrollbars>
                <MessageComposer conversation={currentConversation} onFocus={this.goToBottom} onSend={this.onSend} />
            </div>
        );
    }
}

MessagesContainer.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    messagesReady: PropTypes.bool,
    currentConversation: PropTypes.instanceOf(Conversation),
};

const ConversationArea = withTracker(({ currentConversation }) => {
    let messagesReady;
    let messages;
    if (currentConversation) {
        messagesReady = subsCache.subscribe('socialize.messagesFor', currentConversation._id).ready();
        messages = currentConversation.messages({ sort: { createdAt: 1 } }).fetch();
    }
    return {
        currentConversation,
        messagesReady,
        messages,
    };
})(MessagesContainer);

export default ConversationArea;
