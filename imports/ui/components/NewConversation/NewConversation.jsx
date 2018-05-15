import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';

import { Label, Glyphicon, Alert } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';

import UserTile from '../UserTile/UserTile.jsx';
import MessageComposer from '../../components/MessageComposer/MessageComposer.jsx';

export default class NewConversation extends Component {
    static propTypes = {
        toUser: PropTypes.instanceOf(User),
    }
    constructor(props) {
        super(props);
        const { toUser } = this.props;
        const selectedUsers = [];
        if (toUser) selectedUsers.push(toUser);
        this.state = { selectedUsers, searchQuery: '' };
    }
    search = (e) => {
        const query = e.target.value;
        let search;
        if (query) {
            search = query;
        }
        this.setState({ searchQuery: search });
    }
    handleRemoveParticipant = (e, user) => {
        e.preventDefault();
        const { toUser } = this.props;
        if (toUser && toUser._id === user._id) {
            browserHistory.replace('/messages/new');
        }
        const { selectedUsers } = this.state;
        const newParticipants = selectedUsers.filter(participant => participant._id !== user._id);
        this.setState({ selectedUsers: newParticipants });
    }
    render() {
        const { selectedUsers, searchQuery } = this.state;
        const { toUser } = this.props;
        const selectedIds = selectedUsers.map(user => user._id);
        const selector = { _id: { $nin: [Meteor.userId(), ...selectedIds], $in: Meteor.user().friends().map(friend => friend.friendId) } };

        if (searchQuery) {
            selector.username = new RegExp(searchQuery, 'i');
        }
        const potentialParticipants = Meteor.users.find(selector).fetch();

        return (
            <div id="messages-column">
                <div id="conversation-header">
                    <p className="text-center">New Conversation</p>
                    {/* <input type="text" onChange={this.search} value={this.state.searchQuery} /> */}
                </div>
                <Scrollbars
                    className="scroll-area"
                    universal
                    renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
                >
                    {!this.state.composing && !toUser &&
                        (
                            potentialParticipants.length === 0 && selectedUsers.length === 0 ?
                                <Alert bsStyle="danger" style={{ margin: '20px' }}>
                                    <h4>No Friends</h4>
                                    You don&apos;t have any friends to send messages to yet. You can visit a users profile and either initiate a message, or request to be their friend.
                                </Alert> :
                                <div id="select-participants">
                                    {
                                        potentialParticipants.map(user => (
                                            <UserTile
                                                key={user._id}
                                                user={user}
                                                size={80}
                                                noLink
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newParticipants = [...this.state.selectedUsers, user];
                                                    this.setState({ selectedUsers: newParticipants, searchQuery: '' });
                                                }}
                                            />
                                        ))
                                    }
                                </div>
                        )
                    }
                </Scrollbars>
                <div id="selected-participants">
                    { selectedUsers.length > 0 ?
                        selectedUsers.map(user => (
                            <span key={user._id}>
                                <Label
                                    bsStyle="primary"
                                    onClick={e => this.handleRemoveParticipant(e, user)}
                                >
                                    <Glyphicon glyph="remove" /> {user.username}
                                </Label>&nbsp;
                            </span>
                        )) : <span>&nbsp;</span>
                    }
                </div>
                <MessageComposer
                    participants={this.state.selectedUsers}
                    onFocus={() => this.setState({ composing: true })}
                    onBlur={() => this.setState({ composing: false })}
                    disabled={!this.state.selectedUsers.length > 0}
                />
            </div>
        );
    }
}
