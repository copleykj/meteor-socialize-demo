import React from 'react';

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import PostComponent from '../../components/Post/Post.jsx';

const ProfileFeed = ({ posts, ready }) => (
    <div id="profile-feed">
        {posts.map(post => <PostComponent post={post} key={post._id} />)}
    </div>
);

export default withTracker(({ user }) => {
    let ready = false;
    let posts = [];
    if (user) {
        ready = Meteor.subscribe('socialize.feed.postsByOwner', user._id).ready();

        posts = user.feed().postsByOwner().fetch();
    }
    return {
        ready,
        posts,
    };
})(ProfileFeed);
