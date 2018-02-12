import { Button, SplitButton, MenuItem, ButtonToolbar, Grid } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Profile, ProfilesCollection } from 'meteor/socialize:user-profile';
import { User } from 'meteor/socialize:user-model';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import MainHeader from '../../layouts/MainHeader/MainHeader';
import ReactLetterAvatar from '../../components/LetterAvatar/LetterAvatar.jsx';

class UserProfile extends Component {
    handleProfileAction = () => {
        const { areFriends, hasRequest, hasPendingRequest, profileUser } = this.props;

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
    handleSendMessage = async () => {
        const { profileUser } = this.props;
        const conversationId = await Meteor.user().findExistingConversationWithUsers([profileUser._id]) || `new?toUsername=${profileUser.username}`;
        if (conversationId) {
            browserHistory.push(`/messages/${conversationId}`);
        }
    }
    render() {
        const {
            ready,
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
                { ready &&
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
                                    <Button onClick={this.handleSendMessage} bsStyle="info" bsSize="small">Message</Button>
                                </ButtonToolbar>
                            }
                        </header>
                    </Grid>
                }
            </MainHeader>
        );
    }
}


const UserProfileContainer = createContainer(({ params, user }) => {
    const { username } = params;
    const ready = Meteor.subscribe('socialize.userProfile', username).ready();
    const profile = ProfilesCollection.findOne({ username });

    let profileUser;
    let areFriends;
    let hasRequest;
    let hasPendingRequest;
    let blocking;
    let isSelf;

    if (ready) {
        profileUser = profile && profile.user();
        areFriends = profileUser && profileUser.isFriendsWith();
        hasRequest = user.hasFriendshipRequestFrom(profileUser);
        hasPendingRequest = profileUser.hasFriendshipRequestFrom(user);
        isSelf = profileUser.isSelf();
    }
    return {
        ready,
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
    ready: PropTypes.bool,
    areFriends: PropTypes.bool,
    hasRequest: PropTypes.bool,
    hasPendingRequest: PropTypes.bool,
    isSelf: PropTypes.bool,
    profileUser: PropTypes.instanceOf(User),
    user: PropTypes.instanceOf(User),
    profile: PropTypes.instanceOf(Profile),
    params: PropTypes.shape({
        username: PropTypes.string,
    }),
};

export default UserProfileContainer;
