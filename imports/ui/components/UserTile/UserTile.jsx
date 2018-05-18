import { User } from 'meteor/socialize:user-model';
import PropTypes from 'prop-types';
import React from 'react';

import UserAvatar from '../UserAvatar/UserAvatar.jsx';

const UserTile = ({ user, size, flex, noLink, onClick, showStatus }) => (
    <div className="user-tile" onClick={onClick}>
        <UserAvatar user={user} size={size} flex={flex} noLink={noLink} showStatus={showStatus}>
            <span>{user.username}</span>
        </UserAvatar>
    </div>
);

UserTile.propTypes = {
    user: PropTypes.instanceOf(User),
    size: PropTypes.number,
    flex: PropTypes.bool,
    noLink: PropTypes.bool,
    onClick: PropTypes.func,
    showStatus: PropTypes.bool,
};

export default UserTile;
