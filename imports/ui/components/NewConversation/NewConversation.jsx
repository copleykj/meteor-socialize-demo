import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';

import { Label, Glyphicon } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';

import MessageComposer from '../../components/MessageComposer/MessageComposer.jsx';

export default class NewConversation extends Component {
    static propTypes = {
        toUser: PropTypes.instanceOf(User),
    }
    state = { selectedUsers: [], searchQuery: '' }
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
        let { selectedUsers } = this.state;
        const { searchQuery } = this.state;
        const { toUser } = this.props;
        if (toUser) selectedUsers = [...selectedUsers, toUser];
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
                    {selectedUsers.length > 0 ?
                        <p>
                            <span>To: </span>
                            {
                                selectedUsers.map(user => (
                                    <span key={user._id}>
                                        <Label
                                            bsStyle="primary"
                                            onClick={e => this.handleRemoveParticipant(e, user)}
                                        >
                                            {user.username} <Glyphicon glyph="remove" />
                                        </Label>&nbsp;
                                    </span>
                                ))
                            }
                        </p> :
                        <p>
                            Select users below...
                        </p>
                    }
                    <hr />
                    {/* <input type="text" onChange={this.search} value={this.state.searchQuery} /> */}
                </div>
                <Scrollbars
                    className="scroll-area"
                    universal
                    renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
                >
                    <div>
                        {!this.state.composing && !toUser &&
                            (
                                potentialParticipants.length === 0 && selectedUsers.length === 0 ?
                                    <p>You don&apos;t have any friends yet. Visit a user profile to message them if you are not yet friends.</p> :
                                    potentialParticipants.map(user => (
                                        <span key={user._id}>
                                            <Label
                                                bsStyle="success"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newParticipants = [...this.state.selectedUsers, user];
                                                    this.setState({ selectedUsers: newParticipants, searchQuery: '' });
                                                }}
                                            >
                                                <Glyphicon glyph="plus" /> {user.username}
                                            </Label>&nbsp;
                                        </span>
                                    ))
                            )
                        }
                    </div>
                </Scrollbars>
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
