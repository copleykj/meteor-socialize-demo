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

const Dashboard = ({ user, posts, onlineFriends, params, ...props }) => (
    <MainHeader user={user} params={params} {...props}>
        <Grid>
            <Row>
                <Col xs={5}>
                    <Composer user={user} />
                    {
                        posts.map(post => (
                            <PostComponent post={post} key={post._id} />
                        ))
                    }
                </Col>
                <Col xs={4} />
            </Row>
        </Grid>
    </MainHeader>
);

Dashboard.propTypes = {
    user: PropTypes.instanceOf(User),
    posts: PropTypes.arrayOf(PropTypes.instanceOf(Post)),
    onlineFriends: PropTypes.arrayOf(PropTypes.instanceOf(User)),
    params: PropTypes.shape({
        conversationId: PropTypes.string,
    }),
};

const DashboardContainer = withTracker(({ user }) => {
    Meteor.subscribe('socialize.feed.friendsPosts', user._id);
    return {
        user,
        posts: user.feed().friendsPosts({ sort: { createdAt: -1 } }).fetch(),
    };
})(Dashboard);

export default DashboardContainer;
