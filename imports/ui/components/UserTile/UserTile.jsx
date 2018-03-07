import { User } from 'meteor/socialize:user-model';
import PropTypes from 'prop-types';
import React from 'react';

import UserAvatar from '../UserAvatar/UserAvatar.jsx';

const UserTile = ({ user }) => (
    <div className="user-tile">
        <UserAvatar user={user} size={110} />
        <span>{user.username}</span>
    </div>
);

UserTile.propTypes = {
    user: PropTypes.instanceOf(User),
};

export default UserTile;
