import { Meteor } from 'meteor/meteor';

import { AutoForm, AutoField } from 'uniforms-bootstrap3';
import { Button, SplitButton, MenuItem, ButtonToolbar, Grid, Modal, Row, Col } from 'react-bootstrap';
import { Profile, ProfilesCollection } from 'meteor/socialize:user-profile';
import { User } from 'meteor/socialize:user-model';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import MainHeader from '../../layouts/MainHeader/MainHeader';
import ReactLetterAvatar from '../../components/LetterAvatar/LetterAvatar.jsx';
import ProfileFeed from '../../components/ProfileFeed/ProfileFeed.jsx';
import { handleSendMessage } from '../../../utils/messaging.js';

class UserProfile extends Component {
    state = { showModal: false }
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
    handleShow = () => {
        this.setState({ showModal: true });
    }
    handleHide = () => {
        this.setState({ showModal: false });
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
            ...props
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
            <MainHeader user={user} params={params} paddingTop={'60px'} {...props}>
                { ready &&
                    <Grid id="user-profile-page">
                        <header>
                            <ReactLetterAvatar name={profileUser.username} size={150} className="avatar" />
                            <h1 className="username">{profile.fullName()} ({profileUser.username})</h1>

                            {isSelf ?
                                <ButtonToolbar>
                                    <Button onClick={this.handleShow} bsStyle="warning" bsSize="small">Edit Profile</Button>
                                </ButtonToolbar> :
                                <ButtonToolbar>
                                    <SplitButton onClick={this.handleProfileAction} bsStyle="info" bsSize="small" title={actionText} id="profile-actions">
                                        <MenuItem eventKey="1">Block</MenuItem>
                                    </SplitButton>
                                    <Button onClick={() => handleSendMessage(profileUser)} bsStyle="info" bsSize="small">Message</Button>
                                </ButtonToolbar>
                            }
                        </header>
                        <Row>
                            <Col xs={6}>
                                <ProfileFeed user={profileUser} />
                            </Col>
                        </Row>
                    </Grid>
                }
                <Modal
                    show={this.state.showModal}
                    onHide={this.handleHide}
                >
                    {profile &&
                        <AutoForm
                            schema={profile._getSchema()}
                            onSubmit={(doc) => { doc.save(); this.handleHide(); }}
                            model={profile}
                        >
                            <Modal.Header>
                                <Modal.Title>Edit Profile</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <Row>
                                    <Col xs={6}>
                                        <AutoField name="firstName" />
                                    </Col>
                                    <Col xs={6}>
                                        <AutoField name="lastName" />
                                    </Col>
                                </Row>

                            </Modal.Body>

                            <Modal.Footer>
                                <Button onClick={this.handleHide}>Close</Button>
                                <Button type="submit" bsStyle="primary">Save changes</Button>
                            </Modal.Footer>
                        </AutoForm>
                    }
                </Modal>
            </MainHeader>
        );
    }
}


const UserProfileContainer = withTracker(({ params, user }) => {
    const { username } = params;
    const ready = Meteor.subscribe('socialize.userProfile', username).ready();

    let profile;
    let profileUser;
    let areFriends;
    let hasRequest;
    let hasPendingRequest;
    let blocking;
    let isSelf;

    if (ready) {
        profile = ProfilesCollection.findOne({ username });
        profileUser = profile.user();
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
})(UserProfile);

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
