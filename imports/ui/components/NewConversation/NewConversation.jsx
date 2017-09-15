import { Meteor } from 'meteor/meteor';

import { Label, Glyphicon } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import React, { Component } from 'react';

import MessageComposer from '../../components/MessageComposer/MessageComposer.jsx';

export default class NewConversation extends Component {
    state = { selectedUsers: [], searchQuery: '' };
    search = (e) => {
        const query = e.target.value;
        let search;
        if (query) {
            search = query;
        }
        this.setState({ searchQuery: search });
    }
    render() {
        const { searchQuery, selectedUsers } = this.state;
        const selectedIds = selectedUsers.map(user => user._id);
        const selector = { _id: { $nin: [Meteor.userId(), ...selectedIds] } };

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
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const newParticipants = selectedUsers.filter(participant => participant._id !== user._id);
                                                this.setState({ selectedUsers: newParticipants });
                                            }}
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
                        {!this.state.composing &&
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
