import { Grid, Col, Row, Well } from 'react-bootstrap';
import { User } from 'meteor/socialize:user-model';
import { Post } from 'meteor/socialize:postable';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React from 'react';

import MainHeader from '../../layouts/MainHeader/MainHeader.jsx';
import PostComponent from '../../components/Post/Post.jsx';
import Composer from '../../components/Composer/Composer.jsx';


const Dashboard = ({ user, posts, onlineFriends }) => (
    <MainHeader user={user}>
        <Grid>
            <Row>
                <Col xs={5}>
                    {Composer(user)}
                    {
                        posts.map(post => (
                            <PostComponent post={post} key={post._id} />
                        ))
                    }
                </Col>
                <Col xs={4} />
                <Col xs={3}>
                    <h4>Online Friends</h4>
                    <hr />
                    {
                        onlineFriends.map(friend => (
                            <Well bsSize="small" key={friend._id}>
                                {friend.username}
                                <span
                                    className="pull-right"
                                    style={{
                                        display: 'inline-block',
                                        padding: '6px',
                                        margin: '4px',
                                        borderRadius: '50%',
                                        backgroundColor: friend.status === 'online' ? 'YellowGreen' : 'DarkOrange',
                                    }}
                                />
                            </Well>
                        ))
                    }
                </Col>
            </Row>
        </Grid>
    </MainHeader>
);

Dashboard.propTypes = {
    user: PropTypes.instanceOf(User),
    posts: PropTypes.arrayOf(PropTypes.instanceOf(Post)),
    onlineFriends: PropTypes.arrayOf(PropTypes.instanceOf(User)),
};

const DashboardContainer = createContainer(({ user }) => {
    let x;
    return {
        x,
        user,
        posts: user.feed().posts({ sort: { date: -1 } }).fetch(),
        onlineFriends: user.onlineFriends().fetch(),
    };
}, Dashboard);

export default DashboardContainer;
