import { Meteor } from 'meteor/meteor';
import React from 'react';
import { browserHistory } from 'react-router';
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';

const handleLogout = () => {
    Meteor.logout((error) => {
        if (!error) {
            browserHistory.replace('/login');
        }
    });
};

export default user => (
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
);
