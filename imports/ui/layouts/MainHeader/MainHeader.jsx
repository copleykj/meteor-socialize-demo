import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem, Badge } from 'react-bootstrap';

const handleLogout = () => {
    Meteor.logout((error) => {
        if (!error) {
            browserHistory.replace('/login');
        }
    });
};

const MainHeader = ({ user, numUnreadConversations, newestConversationId, children, paddingTop }) => (
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
                    <MenuItem>Friends</MenuItem>
                    <MenuItem>Account</MenuItem>
                    <MenuItem divider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </NavDropdown>
            </Nav>
        </Navbar>
        {children}
    </div>
);

MainHeader.propTypes = {
    user: PropTypes.instanceOf(User),
    numUnreadConversations: PropTypes.number,
    newestConversationId: PropTypes.string,
    children: PropTypes.node,
    paddingTop: PropTypes.string,
};

MainHeader.defaultProps = {
    paddingTop: '80px',
};

const MainHeaderContainer = createContainer(({ user, params, ...props }) => {
    const unreadConversation = user.newestConversation();
    const newestConversationId = params.conversationId || (unreadConversation && unreadConversation._id);
    return {
        user,
        numUnreadConversations: user.numUnreadConversations(),
        newestConversationId,
        ...props,
    };
}, MainHeader);

export default MainHeaderContainer;
