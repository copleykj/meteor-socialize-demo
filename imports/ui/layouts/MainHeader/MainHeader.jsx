import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem, Badge } from 'react-bootstrap';

import { addQuery, removeQuery } from '../../../utils/router.js';
import FriendsList from '../../components/FriendsList/FriendsList.jsx';

const handleLogout = () => {
    Meteor.logout((error) => {
        if (!error) {
            browserHistory.replace('/login');
        }
    });
};

class MainHeader extends Component {
    state = { showFriends: false }
    handleShow = () => {
        addQuery({ showFriends: true });
    }
    handleHide= () => {
        removeQuery('showFriends');
    }
    render() {
        const { user, numUnreadConversations, newestConversationId, children, paddingTop, showFriends } = this.props;
        return (
            <div style={{ paddingTop }}>
                <Navbar fixedTop>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">Socialize</Link>
                        </Navbar.Brand>
                    </Navbar.Header>

                    <Nav>
                        <LinkContainer to={`/messages/${newestConversationId || 'new'}`}><NavItem>Messages <Badge bsStyle="info">{numUnreadConversations || ''}</Badge></NavItem></LinkContainer>
                    </Nav>

                    <Nav pullRight>
                        <NavDropdown title={user.username} id="user-menu">
                            <LinkContainer to={`/profile/${user.username}`}>
                                <MenuItem>My Profile</MenuItem>
                            </LinkContainer>
                            <MenuItem onClick={this.handleShow}>Friends</MenuItem>
                            <MenuItem>Account</MenuItem>
                            <MenuItem divider />
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar>
                {children}
                { showFriends && <FriendsList show={showFriends} handleHide={this.handleHide} /> }
            </div>
        );
    }
}

MainHeader.propTypes = {
    user: PropTypes.instanceOf(User),
    showFriends: PropTypes.bool,
    numUnreadConversations: PropTypes.number,
    newestConversationId: PropTypes.string,
    children: PropTypes.node,
    paddingTop: PropTypes.string,
};

MainHeader.defaultProps = {
    paddingTop: '80px',
};

const MainHeaderContainer = createContainer(({ user, params, location: { query } }) => {
    Meteor.subscribe('socialize.unreadConversations').ready();
    Meteor.subscribe('socialize.conversations', { limit: 1 }).ready();
    const unreadConversation = user.newestConversation();
    const newestConversationId = params.conversationId || (unreadConversation && unreadConversation._id);
    return {
        user,
        numUnreadConversations: user.numUnreadConversations(),
        newestConversationId,
        showFriends: !!query.showFriends,
    };
}, MainHeader);

export default MainHeaderContainer;
