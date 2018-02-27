import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { User } from 'meteor/socialize:user-model';

import React from 'react';
import PropTypes from 'prop-types';

import UserAvatar from '../UserAvatar/UserAvatar.jsx';

const OnlineFriends = ({ onlineFriends }) => (
    <div id="online-friends">
        {
            onlineFriends.map(friend => (
                <div key={friend._id}>
                    <UserAvatar className="avatar" size={30} user={friend} />
                    <span className="username">{friend.username}</span>
                    <span
                        style={{
                            display: 'inline-block',
                            padding: '6px',
                            margin: '4px',
                            borderRadius: '50%',
                            backgroundColor: friend.status === 'online' ? 'YellowGreen' : 'DarkOrange',
                        }}
                    />
                </div>
            ))
        }
    </div>
);

OnlineFriends.propTypes = {
    onlineFriends: PropTypes.arrayOf(PropTypes.instanceOf(User)),
};

const OnlineFriendsContainer = withTracker(({ user }) => {
    Meteor.subscribe('onlineFriends');
    const onlineFriends = user.onlineFriends().fetch();
    return {
        onlineFriends,
    };
})(OnlineFriends);

export default OnlineFriendsContainer;
