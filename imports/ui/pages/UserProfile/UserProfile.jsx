import { Button, SplitButton, MenuItem, ButtonToolbar, Grid } from 'react-bootstrap';
import { Profile, ProfilesCollection } from 'meteor/socialize:user-profile';
import { User } from 'meteor/socialize:user-model';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import MainHeader from '../../layouts/MainHeader/MainHeader';
import ReactLetterAvatar from '../../components/LetterAvatar/LetterAvatar.jsx';

class UserProfile extends Component {
    handleProfileAction = () => {
        const { areFriends, hasRequest, hasPendingRequest, blocking, isSelf, profileUser } = this.props;

        if (areFriends) {
            profileUser.unfriend();
        } else if (hasRequest) {
            profileUser.acceptFriendshipRequest();
        } else if (hasPendingRequest) {
            profileUser.cancelFriendshipRequest();
        } else {
            profileUser.requestFriendship();
        }
    }
    render() {
        const {
            areFriends,
            hasRequest,
            hasPendingRequest,
            isSelf,
            profileUser,
            profile,
            user,
            params,
        } = this.props;

        let actionText;

        if (areFriends) {
            actionText = 'Unfriend';
        } else if (hasRequest) {
            actionText = 'Accept Request';
        } else if (hasPendingRequest) {
            actionText = 'Cancel Request';
        } else {
            actionText = 'Add Friend';
        }
        return (
            <MainHeader user={user} params={params} paddingTop={'60px'}>
                <Grid id="user-profile-page">
                    <header>
                        <ReactLetterAvatar name={profileUser.username} size={150} className="avatar" />
                        <h1 className="username">{profileUser.username}</h1>
                        {isSelf ?
                            <ButtonToolbar><Button bsStyle="warning" bsSize="small">Edit Profile</Button></ButtonToolbar> :
                            <ButtonToolbar>
                                <SplitButton onClick={this.handleProfileAction} bsStyle="info" bsSize="small" title={actionText} id="profile-actions">
                                    <MenuItem eventKey="1">Block</MenuItem>
                                </SplitButton>
                                <Button bsStyle="info" bsSize="small">Message</Button>
                            </ButtonToolbar>
                        }
                    </header>
                </Grid>
            </MainHeader>
        );
    }
}


const UserProfileContainer = createContainer(({ params, user }) => {
    const { username } = params;
    const profile = ProfilesCollection.findOne({ username });
    const profileUser = profile && profile.user();

    const areFriends = profileUser.isFriendsWith(user);
    const hasRequest = user.hasFriendshipRequestFrom(profileUser);
    const hasPendingRequest = profileUser.hasFriendshipRequestFrom(user);
    const blocking = profileUser.blocksUser(user) || user.blocksUser(profileUser);
    const isSelf = profileUser.isSelf();
    return {
        areFriends,
        hasRequest,
        hasPendingRequest,
        blocking,
        isSelf,
        profileUser,
        profile,
        params,
        user,
    };
}, UserProfile);

UserProfile.propTypes = {
    areFriends: PropTypes.bool,
    hasRequest: PropTypes.bool,
    hasPendingRequest: PropTypes.bool,
    blocking: PropTypes.bool,
    isSelf: PropTypes.bool,
    profileUser: PropTypes.instanceOf(User),
    user: PropTypes.instanceOf(User),
    profile: PropTypes.instanceOf(Profile),
    params: PropTypes.shape({
        username: PropTypes.string,
    }),
};

export default UserProfileContainer;
