import { Meteor } from 'meteor/meteor';

import { ConversationsCollection, Message, Conversation, Participant } from 'meteor/socialize:messaging';
import { Grid, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { User } from 'meteor/socialize:user-model';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React from 'react';

import UserAvatar from '../../components/UserAvatar/UserAvatar.jsx';
import ConversationArea from '../../components/ConversationArea/ConversationArea.jsx';
import MainHeader from '../../layouts/MainHeader/MainHeader.jsx';
import NewConversation from '../../components/NewConversation/NewConversation.jsx';
import Loader from '../../components/Loader/Loader.jsx';


const Messages = ({ user, currentConversation, conversationParticipants, params, toUser, ...props }) => (
    <MainHeader user={user} paddingTop="60px" params={params} {...props} >
        <Grid id="messages-page">
            <ConversationsContainer user={user} shouldShow={!!params.conversationId} />
            {params.conversationId === 'new' ?
                <NewConversation toUser={toUser} /> :
                <ConversationArea currentConversation={currentConversation} />
            }
            <div id="participants-column" className="hidden-xs hidden-sm">
                {conversationParticipants &&
                    conversationParticipants.map(participant => (
                        <ParticipantContainer participant={participant} key={participant._id} />
                    ))
                }
            </div>
        </Grid>
    </MainHeader>
);

const MessagesContainer = withTracker(({ user, params, location: { query: { toUsername } } }) => {
    const { conversationId } = params;
    let currentConversation;
    let toUser;
    if (toUsername) {
        Meteor.subscribe('socialize.userProfile', toUsername);
        toUser = Meteor.users.findOne({ username: toUsername });
    }
    if (conversationId && conversationId !== 'new') {
        Meteor.subscribe('socialize.viewingConversation', conversationId);
        currentConversation = ConversationsCollection.findOne(conversationId);
    } else {
        Meteor.subscribe('socialize.friends', user._id).ready();
    }
    return {
        user,
        toUser,
        currentConversation,
        conversationParticipants: currentConversation && currentConversation.participants().fetch(),
    };
})(Messages);

Messages.propTypes = {
    user: PropTypes.instanceOf(User),
    toUser: PropTypes.instanceOf(User),
    currentConversation: PropTypes.instanceOf(Conversation),
    conversationParticipants: PropTypes.arrayOf(PropTypes.instanceOf(Participant)),
    params: PropTypes.shape({
        conversationId: PropTypes.string,
    }),
};

export default MessagesContainer;

const Conversations = ({ conversations, ready, shouldShow }) => (
    <div id="conversations-column" className={shouldShow ? 'hidden-xs' : ''}>
        <header><h4>Conversations</h4><Link to="/messages/new"><Glyphicon glyph="edit" /></Link></header>
        <Scrollbars universal>
            <Loader ready={conversations.length !== 0 || ready}>
                <span>
                    {
                        conversations.map(conversation => <ConversationContainer conversation={conversation} key={conversation._id} />)
                    }
                </span>
            </Loader>
        </Scrollbars>
    </div>
);

Conversations.propTypes = {
    conversations: PropTypes.arrayOf(PropTypes.instanceOf(Conversation)),
    ready: PropTypes.bool,
    shouldShow: PropTypes.bool,
};

const ConversationsContainer = withTracker(({ user, shouldShow }) => ({
    ready: Meteor.subscribe('socialize.conversations').ready(),
    conversations: user.conversations({ sort: { updatedAt: -1 } }).fetch(),
    shouldShow,
}))(Conversations);

const ConversationRow = ({ conversation, lastMessage, sender, isUnread }) => {
    const unread = isUnread ? 'unread' : '';
    return (
        <Link to={`/messages/${conversation._id}`} key={conversation._id} activeClassName="active" className={`conversation ${unread}`}>
            <div>
                <UserAvatar
                    user={sender}
                    size={60}
                    noLink
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

const ConversationContainer = withTracker(({ conversation }) => {
    const lastMessage = conversation.lastMessage();
    const sender = lastMessage && lastMessage.user();
    const isUnread = conversation.isUnread();
    return {
        conversation,
        lastMessage,
        sender,
        isUnread,
    };
})(ConversationRow);


const ParticipantListItem = ({ participant, participatingUser }) => (
    <div className="conversation-participant" key={participatingUser._id}>
        <div>
            <UserAvatar
                user={participatingUser}
                size={40}
            />
        </div>
        <div>
            <Link to={`/profile/${participatingUser.username}`}>{participatingUser.username}</Link></div>
        <div>
            {participatingUser.isObserving(participant.conversationId) && <span><Glyphicon glyph="eye-open" /> </span>}
            <span className={`status ${participatingUser.status}`} />
        </div>
    </div>
);

ParticipantListItem.propTypes = {
    participant: PropTypes.instanceOf(Participant),
    participatingUser: PropTypes.instanceOf(User),
};

const ParticipantContainer = withTracker(({ participant }) => ({
    participatingUser: participant.user(),
    participant,
}))(ParticipantListItem);
