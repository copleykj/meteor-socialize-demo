import { Meteor } from 'meteor/meteor';
import { Post } from 'meteor/socialize:postable';
import { User } from 'meteor/socialize:user-model';
import { withTracker } from 'meteor/react-meteor-data';

import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';

import Composer from '../../components/PostComposer/PostComposer.jsx';
import MainHeader from '../../layouts/MainHeader/MainHeader.jsx';
import PostComponent from '../../components/Post/Post.jsx';
import Markdown from '../../components/Markdown/Markdown.jsx';

const billboardMessage = `
Welcome to the __SocializeJs__ Demo. Here you'll find a Facebook style social network implemented using the packages in the [socialize package set](https://atmospherejs.com/socialize).

# Features

## Post Feed
Here, in the space where you are reading this is a feed that will contain all your posts and any posts created by users that you are "friends" with. Every post can be liked or commented on and each comment can additonally be liked as well. Once your feed has content, this message will disappear. Once you are done reading this fully through, go ahead and create a post and introduce yourself. This feature is facilitated by the following packages.

- [socialize:feed](https://atmospherejs.com/socialize/feed)
- [socialize:postable](https://atmospherejs.com/socialize/postable)
- [socialize:commentable](https://atmospherejs.com/socialize/commentable)
- [socialize:likeable](https://atmospherejs.com/socialize/likeable)

>*Posts and Comments are Markdown enabled.*

## Private/Group Messaging
In the header take notice of the inbox icon. When you have conversations with unread messages an indicator will appear with the number of conversations that are unread. Clicking this icon will bring you to the messaging area. From there you can reply to messages sent to you, or start new conversations with friends, including group messages. When in a conversation you will also see all the other users that are participating in the conversation, as well as their online and conversation viewing status. The messaging features are facilitated by the following packages

- [socialize:messaging](https://atmospherejs.com/socialize/messaging)

>*Messages are Mardown enabled*

## Friends & Friend Requests
In the header directly to the right of the messaging icon you'll find a silohette of a person. This is where you will be notified of new friend requests from other users. When you have new requests an indicator will appear showing the count. This feature is facilitated by the following packages.

- [socialize:friendships](https://atmospherejs.com/socialize/friendships)
- [socialize:requestable](https://atmospherejs.com/socialize/requestable)

## Online Friends
On screens > 1470px you will see right side bar area which will contain any friends that are online. In the future this will be turned into an instant messaging area and when collapsed on smaller screens, will show as box affixed to the bottom of the viewport.

## User Profiles
Generally speaking if you click on a username or a user's avatar you will be taken to their profile. To view your own profile you can click the dropdown menu at the top right in the header that appears as your username. From there click the "My Profile" link.

When on your own profile you can edit your information by clicking the "Edit Profile" link and you can upload a new Avatar by clicking the upload icon which appears over your current avatar.

On other users profile you can initiate a message, Send/Cancel a friendship request, End a friendship, or block them completely by clicking the meatball menu and clicking "block".

This feature is facilitated by the following packages.

- [socialize:user-profile](https://atmospherejs.com/socialize/user-profile)

## User Blocking
From a users profile you can choose to block them. This will stop them from contacting you, viewing your profile and other activity on the site as well as stopping you from viewing theirs. This feature is facilitated by the following packages.

- [socialize:user-blocking](https://atmospherejs.com/socialize/user-blocking)

## Avatar Uploading
From your personal profile you can upload new avatars by clicking the upload icon layered over top of your current avatar. This feature is facilitated by the following packages.

- [socialize:cloudinary](https://atmospherejs.com/socialize/cloudinary)
`;

const Dashboard = ({ user, posts, ready, params, ...props }) => (
    <MainHeader user={user} params={params} {...props}>
        <Grid id="dashboard">
            <Row>
                <Col xs={6}>
                    <Composer user={user} />
                    {ready && (
                        posts.length !== 0 ?
                            posts.map(post => (
                                <PostComponent post={post} key={post._id} />
                            )) :
                            <div id="billboard">
                                <header>
                                    <img src="meteor-logo.svg" alt="" width="200" />
                                    <h1>Socialize Demo</h1>
                                </header>
                                <Markdown
                                    source={billboardMessage}
                                />
                            </div>
                    )}
                </Col>
                <Col xs={6}>
                    <a href="https://www.patreon.com/bePatron?u=4866588" target="_blank" rel="noopener noreferrer">
                        <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a patron" />
                    </a>
                </Col>
            </Row>
        </Grid>
    </MainHeader>
);

Dashboard.propTypes = {
    user: PropTypes.instanceOf(User),
    posts: PropTypes.arrayOf(PropTypes.instanceOf(Post)),
    ready: PropTypes.bool,
    params: PropTypes.shape({
        conversationId: PropTypes.string,
    }),
};

const DashboardContainer = withTracker(({ user }) => {
    const ready = Meteor.subscribe('socialize.feed.friendsPosts', user._id).ready();
    return {
        ready,
        user,
        posts: user.feed().friendsPosts({ sort: { createdAt: -1 } }).fetch(),
    };
})(Dashboard);

export default DashboardContainer;
