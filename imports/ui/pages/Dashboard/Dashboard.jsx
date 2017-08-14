import { Grid, Col, Row } from 'react-bootstrap';
import { User } from 'meteor/socialize:user-model';
import { Post } from 'meteor/socialize:postable';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React from 'react';

import MainHeader from '../../components/MainHeader/MainHeader.jsx';
import PostComponent from '../../components/Post/Post.jsx';
import Composer from '../../components/Composer/Composer.jsx';


const Dashboard = ({ user, posts }) => (
    <div id="page-dashboard" style={{ paddingTop: '80px' }}>
        {MainHeader(user)}

        <Grid>
            <Col xs={5}>
                <Row>
                    {Composer(user)}
                </Row>
                <Row>
                    {
                        posts.map(post => (
                            <PostComponent post={post} key={post._id} />
                        ))
                    }
                </Row>
            </Col>
        </Grid>
    </div>
);

Dashboard.propTypes = {
    user: PropTypes.instanceOf(User),
    posts: PropTypes.arrayOf(PropTypes.instanceOf(Post)),
};

const DashboardContainer = createContainer(({ user }) => {
    let x;
    return {
        x,
        user,
        posts: user.feed().posts(null, null, 'date', -1).fetch(),
    };
}, Dashboard);

export default DashboardContainer;
