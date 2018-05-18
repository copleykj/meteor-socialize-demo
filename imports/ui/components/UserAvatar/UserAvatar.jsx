import { User } from 'meteor/socialize:user-model';
import { Cloudinary } from 'meteor/socialize:cloudinary';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import ReactLetterAvatar from '../LetterAvatar/LetterAvatar.jsx';

const propTypes = {
    user: PropTypes.instanceOf(User),
    size: PropTypes.number,
    noLink: PropTypes.bool,
    flex: PropTypes.bool,
    showStatus: PropTypes.bool,
    children: PropTypes.element,
};

const defaultProps = {
    size: 50,
};

const UserAvatar = ({ user, size, noLink, flex, showStatus, children, ...props }) => {
    let returnElement = null;
    if (user) {
        if (user.avatar) {
            const url = Cloudinary.url(user.avatar, { width: size, height: size, crop: 'lfill', gravity: 'center' });
            returnElement = (
                <img src={url} width={size} height={flex ? size : null} alt="" {...props} />
            );
        } else {
            returnElement = (<ReactLetterAvatar name={user.username} size={size} flex={flex} {...props} />);
        }

        return (
            <div className="user-avatar">
                { noLink ?
                    <div>{returnElement}{children}</div> :
                    <Link to={`/profile/${user.username}`}>
                        {returnElement}{children}
                    </Link>
                }
                {showStatus && user.status &&
                    <div className={`status ${user.status}`} />
                }
            </div>
        );
    }

    return returnElement;
};

UserAvatar.propTypes = propTypes;
UserAvatar.defaultProps = defaultProps;

export default UserAvatar;
