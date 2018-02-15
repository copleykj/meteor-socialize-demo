import { Meteor } from 'meteor/meteor';

import { ConversationsCollection, Message, Conversation } from 'meteor/socialize:messaging';
import { Grid, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { User } from 'meteor/socialize:user-model';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React from 'react';

import ReactLetterAvatar from '../../components/LetterAvatar/LetterAvatar.jsx';
import ConversationArea from '../../components/ConversationArea/ConversationArea.jsx';
import MainHeader from '../../layouts/MainHeader/MainHeader.jsx';
import NewConversation from '../../components/NewConversation/NewConversation.jsx';


const Messages = ({ user, messages, currentConversation, conversationParticipants, params, toUser, ...props }) => (
    <MainHeader user={user} paddingTop="60px" params={params} {...props} >
        <Grid id="messages-page">
            <ConversationsContainer user={user} />
            {params.conversationId === 'new' ?
                <NewConversation toUser={toUser} /> :
                <ConversationArea messages={messages} currentConversation={currentConversation} />
            }
            <div id="participants-column">
                {conversationParticipants &&
                    conversationParticipants.map(participatingUser => (
                        <div className="conversation-participant" key={participatingUser._id}>
                            <div>
                                <ReactLetterAvatar
                                    name={participatingUser.username.toUpperCase()}
                                    size={40}
                                />
                            </div>
                            <div>
                                <Link to={`/profile/${participatingUser.username}`}>{participatingUser.username}</Link></div>
                            <div>
                                {participatingUser.isObserving(currentConversation) && <span><Glyphicon glyph="eye-open" /> </span>}
                                <span className={`status ${participatingUser.status}`} />
                            </div>
                        </div>
                    ))
                }
            </div>
        </Grid>
    </MainHeader>
);

const MessagesContainer = createContainer(({ user, params, location: { query: { toUsername } } }) => {
    const { conversationId } = params;
    let currentConversation;
    let toUser;
    if (toUsername) {
        Meteor.subscribe('socialize.userProfile', toUsername);
        toUser = Meteor.users.findOne({ username: toUsername });
    }
    if (conversationId && conversationId !== 'new') {
        Meteor.subscribe('socialize.viewingConversation', conversationId);
        Meteor.subscribe('socialize.messagesFor', conversationId);
        currentConversation = ConversationsCollection.findOne(conversationId);
        currentConversation && currentConversation.participants().fetch();
    } else {
        Meteor.subscribe('socialize.friends', user._id).ready();
    }
    return {
        user,
        toUser,
        currentConversation,
        conversationParticipants: currentConversation && currentConversation.participantsAsUsers().fetch(),
        messages: currentConversation && currentConversation.messages({ sort: { createdAt: -1 } }).fetch().reverse(),
    };
}, Messages);

Messages.propTypes = {
    user: PropTypes.instanceOf(User),
    toUser: PropTypes.instanceOf(User),
    currentConversation: PropTypes.instanceOf(Conversation),
    conversationParticipants: PropTypes.arrayOf(PropTypes.instanceOf(User)),
    messages: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    params: PropTypes.shape({
        conversationId: PropTypes.string,
    }),
};

export default MessagesContainer;

const Conversations = ({ conversations }) => (
    <div id="conversations-column">
        <header><h4>Conversations</h4><Link to="/messages/new"><Glyphicon glyph="edit" /></Link></header>
        <Scrollbars universal>
            {
                conversations.map(conversation => <ConversationContainer conversation={conversation} key={conversation._id} />)
            }
        </Scrollbars>
    </div>
);

Conversations.propTypes = {
    conversations: PropTypes.arrayOf(PropTypes.instanceOf(Conversation)),
};

const ConversationsContainer = createContainer(({ user }) => ({
    ready: Meteor.subscribe('socialize.conversations'),
    conversations: user.conversations({ sort: { createdAt: -1 } }).fetch(),
}), Conversations);

const ConversationRow = ({ conversation, lastMessage, sender, isUnread }) => {
    const unread = isUnread ? 'unread' : '';
    return (
        <Link to={`/messages/${conversation._id}`} key={conversation._id} activeClassName="active" className={`conversation ${unread}`}>
            <div>
                <ReactLetterAvatar
                    name={sender && sender.username.toUpperCase()}
                    size={60}
                />
            </div>
            <div>
                { sender &&
                    <span>
                        <span className="text-warning">{sender && sender.displayName()}</span>: {lastMessage.body}
                    </span>
                }
            </div>
        </Link>
    );
};

ConversationRow.propTypes = {
    conversation: PropTypes.instanceOf(Conversation),
    lastMessage: PropTypes.instanceOf(Message),
    sender: PropTypes.instanceOf(User),
    isUnread: PropTypes.bool,
};

const ConversationContainer = createContainer(({ conversation }) => {
    const lastMessage = conversation.lastMessage();
    const sender = lastMessage && lastMessage.user();
    const isUnread = conversation.isUnread();
    return {
        conversation,
        lastMessage,
        sender,
        isUnread,
    };
}, ConversationRow);
