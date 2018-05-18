import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { User } from 'meteor/socialize:user-model';
import UserTile from '../UserTile/UserTile.jsx';

const NewUsers = ({ ready, users }) => (
    <span>
        {ready &&
            <div id="new-users">
                <h1>New Users</h1>
                <div>{users.map(user => <UserTile key={user._id} user={user} size={50} showStatus />)}</div>
            </div>
        }
    </span>
);

NewUsers.propTypes = {
    users: PropTypes.arrayOf(PropTypes.instanceOf(User)),
    ready: PropTypes.bool,
};

export default withTracker(({ user }) => {
    const ready = Meteor.subscribe('newUsers').ready();
    const users = Meteor.users.find({ _id: { $ne: user._id } }, { sort: { createdAt: -1 }, limit: 18 }).fetch();

    return { ready, users };
})(NewUsers);
