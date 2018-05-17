import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Dropdown, MenuItem, Glyphicon, Modal } from 'react-bootstrap';

import { handleSendMessage } from '../../../utils/messaging.js';
import UserAvatar from '../UserAvatar/UserAvatar.jsx';

class FriendsList extends Component {
    static propTypes = {
        friends: PropTypes.arrayOf(PropTypes.instanceOf(User)),
        show: PropTypes.bool,
        handleHide: PropTypes.func,
    }
    state = {}
    render() {
        const { friends, show, handleHide } = this.props;
        return (
            <Modal
                show={show}
                onHide={handleHide}
            >
                <Modal.Header>
                    Friends List
                </Modal.Header>
                <Modal.Body>
                    <div id="friends-list">
                        {
                            friends.map(friend => (
                                <div className="friends-list-item" key={friend._id}>
                                    <div>
                                        <UserAvatar
                                            user={friend}
                                            size={60}
                                        />
                                    </div>
                                    <div>
                                        <p><strong>{friend.username}</strong></p>
                                    </div>
                                    <div>
                                        <ButtonToolbar>
                                            <Dropdown id={`${friend._id}-actions`}>
                                                <Dropdown.Toggle bsSize="large" noCaret bsStyle="link">
                                                    <Glyphicon glyph="option-vertical" />
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <MenuItem eventKey="1" onClick={() => handleSendMessage(friend)}>Message</MenuItem>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </ButtonToolbar>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}


export default withTracker(() => {
    const user = Meteor.user();
    Meteor.subscribe('socialize.friends', user._id);
    const friends = user.friendsAsUsers().fetch();
    return {
        friends,
    };
})(FriendsList);
