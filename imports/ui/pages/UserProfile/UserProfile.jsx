import { Meteor } from 'meteor/meteor';
import { Cloudinary } from 'meteor/socialize:cloudinary';

import { AutoForm, AutoField, LongTextField } from 'uniforms-bootstrap3';
import { Button, MenuItem, ButtonToolbar, ButtonGroup, Grid, Modal, Row, Col, Glyphicon, DropdownButton } from 'react-bootstrap';
import { Profile, ProfilesCollection } from 'meteor/socialize:user-profile';
import { User } from 'meteor/socialize:user-model';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import MainHeader from '../../layouts/MainHeader/MainHeader';
import UserAvatar from '../../components/UserAvatar/UserAvatar.jsx';
import ProfileFeed from '../../components/ProfileFeed/ProfileFeed.jsx';
import { handleSendMessage } from '../../../utils/messaging.js';
import Uploader from '../../components/Uploader/Uploader.jsx';
import UserTile from '../../components/UserTile/UserTile.jsx';


class UserProfile extends Component {
    static propTypes = {
        ready: PropTypes.bool,
        areFriends: PropTypes.bool,
        hasRequest: PropTypes.bool,
        hasPendingRequest: PropTypes.bool,
        friends: PropTypes.arrayOf(PropTypes.instanceOf(User)),
        friendsReady: PropTypes.bool,
        isSelf: PropTypes.bool,
        profileUser: PropTypes.instanceOf(User),
        user: PropTypes.instanceOf(User),
        profile: PropTypes.instanceOf(Profile),
        percentUploaded: PropTypes.number,
        params: PropTypes.shape({
            username: PropTypes.string,
        }),
    };
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
            friends,
            friendsReady,
            hasPendingRequest,
            isSelf,
            profileUser,
            profile,
            user,
            params,
            percentUploaded,
            ...props
        } = this.props;

        let actionText;
        let glyph;

        if (areFriends) {
            actionText = 'Unfriend';
            glyph = 'remove-circle';
        } else if (hasRequest) {
            actionText = 'Accept Request';
            glyph = 'ok-circle';
        } else if (hasPendingRequest) {
            actionText = 'Cancel Request';
            glyph = 'minus-sign';
        } else {
            actionText = 'Add Friend';
            glyph = 'plus-sign';
        }
        return (
            <MainHeader user={user} params={params} paddingTop={'60px'} {...props}>
                { ready &&
                    <Grid id="user-profile-page">
                        <header>
                            <section>
                                <div className="avatar-container">
                                    {isSelf &&
                                        <div className="upload-container">
                                            <Uploader title="Choose a new avatar to upload" afterUpload={fileData => Meteor.call('setAvatar', fileData.public_id)} groupId="avatar">
                                                <Button bsStyle="link">
                                                    <Glyphicon glyph="circle-arrow-up" />
                                                </Button>
                                            </Uploader>
                                        </div>
                                    }
                                    <UserAvatar user={profileUser} size={150} className="avatar" />
                                </div>

                                <div className="actions-container">
                                    <h1 className="username">{profile.fullName()} ({profileUser.username})</h1>
                                    <ButtonToolbar>
                                        {isSelf ?
                                            <ButtonGroup>
                                                <Button onClick={this.handleShow} bsStyle="link" bsSize="small"><Glyphicon glyph="edit" /> Edit Profile</Button>
                                            </ButtonGroup> :
                                            <ButtonGroup>
                                                <Button onClick={() => handleSendMessage(profileUser)} className="seperator" bsStyle="link" bsSize="small"><Glyphicon glyph="envelope" /> Message</Button>
                                                <Button onClick={this.handleProfileAction} className="seperator" bsStyle="link" bsSize="small" id="profile-actions">
                                                    <Glyphicon glyph={glyph} />
                                                    {actionText}
                                                </Button>
                                                <DropdownButton title={<Glyphicon glyph="option-vertical" />} id="menu-nav-dropdown" bsStyle="link" noCaret>
                                                    <MenuItem>Block</MenuItem>
                                                </DropdownButton>
                                            </ButtonGroup>
                                        }
                                    </ButtonToolbar>

                                </div>
                            </section>
                        </header>
                        <div className="upload-progress">{!!percentUploaded && <div style={{ width: `${percentUploaded}%` }} />}</div>
                        <Row id="profile-content">
                            <Col xs={6} className="left">
                                {profile && profile.about && profile.about.length !== 0 &&
                                    <div id="about">
                                        <p>{profile.about}</p>
                                    </div>
                                }
                                {friendsReady && friends.length > 0 &&
                                    <div id="profile-friends">
                                        {friends.map(friend => <UserTile key={friend._id} user={friend} />)}
                                    </div>
                                }
                            </Col>
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
                                <Row>
                                    <Col xs={12}>
                                        <AutoField name="about" component={LongTextField} />
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
    let uploadingFile;

    if (Meteor.isClient) {
        uploadingFile = Cloudinary.collection.findOne({ status: 'uploading', groupId: 'avatar' });
    }

    let profile;
    let profileUser;
    let areFriends;
    let hasRequest;
    let hasPendingRequest;
    let blocking;
    let isSelf;
    let friends;
    let friendsReady;

    if (ready) {
        profile = ProfilesCollection.findOne({ username });
        profileUser = profile.user();
        friendsReady = Meteor.subscribe('socialize.friends', profileUser._id, { limit: 4 }).ready();
        friends = profileUser.friendsAsUsers({ limit: 4 }).fetch();
        areFriends = profileUser && profileUser.isFriendsWith();
        hasRequest = user.hasFriendshipRequestFrom(profileUser);
        hasPendingRequest = profileUser.hasFriendshipRequestFrom(user);
        isSelf = profileUser.isSelf();
    }
    return {
        ready,
        areFriends,
        hasRequest,
        friends,
        friendsReady,
        hasPendingRequest,
        blocking,
        isSelf,
        profileUser,
        profile,
        params,
        user,
        percentUploaded: uploadingFile && uploadingFile.percent_uploaded,
    };
})(UserProfile);


export default UserProfileContainer;
