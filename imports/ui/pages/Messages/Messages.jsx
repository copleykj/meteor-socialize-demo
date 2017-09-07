import { Meteor } from 'meteor/meteor';

import { ConversationsCollection, Participant, Message, Conversation } from 'meteor/socialize:messaging';
import { User } from 'meteor/socialize:user-model';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { Grid } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';


import MainHeader from '../../layouts/MainHeader/MainHeader.jsx';
import ConversationArea from '../../components/ConversationArea/ConversationArea.jsx';


const Messages = ({ user, messages, currentConversation, conversationParticipants, params }) => (
    <MainHeader user={user} paddingTop="60px" params={params}>
        <Grid id="messages-page">
            <ConversationsContainer user={user} />
            <ConversationArea messages={messages} currentConversation={currentConversation} />
            <div id="participants-column">
                {conversationParticipants &&
                    conversationParticipants.map(participatingUser => (
                        <div className="conversation-participant" key={participatingUser._id}>
                            <div>
                                <img src="http://via.placeholder.com/40x40" alt="placeholder" />
                            </div>
                            <div>{participatingUser.username}</div>
                            <div><span className={`status ${participatingUser.status}`} /></div>
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
    conversationParticipants: PropTypes.arrayOf(PropTypes.instanceOf(Participant)),
    messages: PropTypes.arrayOf(PropTypes.instanceOf(Message)),
    params: PropTypes.shape({
        conversationId: PropTypes.string,
    }),
};

export default MessagesContainer;

const Conversations = ({ conversations }) => (
    <div id="conversations-column">
        <Scrollbars universal>
            {
                conversations.map((conversation) => {
                    const lastMessage = conversation.lastMessage();
                    const sender = lastMessage && lastMessage.user();
                    return (
                        <Link to={`/messages/${conversation._id}`} key={conversation._id} activeClassName="active">
                            <div className="conversation">
                                <div>
                                    <img src="http://via.placeholder.com/60x60" alt="placeholder" />
                                </div>
                                <div>
                                    { sender &&
                                        <span>
                                            <span className="text-warning">{sender.displayName()}</span>: {lastMessage.body}
                                        </span>
                                    }
                                </div>
                            </div>
                        </Link>
                    );
                })
            }
        </Scrollbars>
    </div>
);

Conversations.propTypes = {
    conversations: PropTypes.arrayOf(PropTypes.instanceOf(Conversation)),
};

const ConversationsContainer = createContainer(({ user }) => ({
    conversations: user.conversations({ sort: { date: -1 }, fields: { _id: true } }).fetch(),
}), Conversations);
