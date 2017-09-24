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


const Messages = ({ user, messages, currentConversation, conversationParticipants, params }) => (
    <MainHeader user={user} paddingTop="60px" params={params}>
        <Grid id="messages-page">
            <ConversationsContainer user={user} />
            {params.conversationId === 'new' ?
                <NewConversation /> :
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
                            <div>{participatingUser.username}</div>
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

const MessagesContainer = createContainer(({ user, params }) => {
    params.conversationId && Meteor.subscribe('viewingConversation', params.conversationId);
    const currentConversation = ConversationsCollection.findOne(params.conversationId);
    currentConversation && currentConversation.participants().fetch();
    return {
        user,
        currentConversation,
        conversationParticipants: currentConversation && currentConversation.participantsAsUsers().fetch(),
        messages: currentConversation && currentConversation.messages().fetch(),
    };
}, Messages);

Messages.propTypes = {
    user: PropTypes.instanceOf(User),
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
    conversations: user.conversations({ sort: { date: -1 } }).fetch(),
}), Conversations);

const ConversationRow = ({ conversation, lastMessage, sender, isUnread }) => {
    const unread = isUnread ? 'unread' : '';
    return (
        <Link to={`/messages/${conversation._id}`} key={conversation._id} activeClassName="active" className={`conversation ${unread}`}>
            <div>
                <ReactLetterAvatar
                    name={sender.username.toUpperCase()}
                    size={60}
                />
            </div>
            <div>
                { sender &&
                    <span>
                        <span className="text-warning">{sender.displayName()}</span>: {lastMessage.body}
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
    const sender = lastMessage.user();
    const isUnread = conversation.isUnread();
    return {
        conversation,
        lastMessage,
        sender,
        isUnread,
    };
}, ConversationRow);
