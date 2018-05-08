import { User } from 'meteor/socialize:user-model';
import PropTypes from 'prop-types';
import React from 'react';

import UserAvatar from '../UserAvatar/UserAvatar.jsx';

const UserTile = ({ user, size }) => (
    <div className="user-tile">
        <UserAvatar user={user} size={size} flex />
        <span>{user.username}</span>
    </div>
);

UserTile.propTypes = {
    user: PropTypes.instanceOf(User),
    size: PropTypes.number,
};

export default UserTile;
