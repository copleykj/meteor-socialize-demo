import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';
import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';

const handleLogout = () => {
    Meteor.logout((error) => {
        if (!error) {
            browserHistory.replace('/login');
        }
    });
};

const MainHeader = ({ user, children }) => (
    <div style={{ paddingTop: '80px' }}>
        <Navbar fixedTop>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">Socialize</a>
                </Navbar.Brand>
            </Navbar.Header>
            <Nav pullRight>
                <NavDropdown title={user.username} id="user-menu">
                    <MenuItem>My Profile</MenuItem>
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
    children: PropTypes.node,
};

export default MainHeader;
