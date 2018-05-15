import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';
import { Request } from 'meteor/socialize:requestable';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, NavItem, MenuItem, Dropdown, Badge, Glyphicon } from 'react-bootstrap';
import ReactResizeDetector from 'react-resize-detector';

import { addQuery, removeQuery } from '../../../utils/router.js';
import FriendsList from '../../components/FriendsList/FriendsList.jsx';
import OnlineFriends from '../../components/OnlineFriends/OnlineFriends.jsx';
import RequestItem from '../../components/RequestItem/RequestItem.jsx';
import LatestConversationCollection from '../../../config/collection.js';

const handleLogout = () => {
    Meteor.logout((error) => {
        if (!error) {
            browserHistory.replace('/login');
        }
    });
};

class MainHeader extends Component {
    state = { showFriends: false, coloredNavbar: false }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    onResize = (width) => {
        if (width) {
            if (width > 1470) {
                this.setState({ hideOnlineFriends: false });
            } else {
                this.setState({ hideOnlineFriends: true });
            }
        }
    }
    handleScroll = () => {
        const { scrollY } = window;
        const { coloredNavbar } = this.state;
        if (scrollY >= 20 && !coloredNavbar) {
            this.setState({ coloredNavbar: true });
        }

        if (scrollY < 20 && coloredNavbar) {
            this.setState({ coloredNavbar: false });
        }
    }
    handleShow = () => {
        addQuery({ showFriends: true });
    }
    handleHide= () => {
        removeQuery('showFriends');
    }
    render() {
        const { user, numUnreadConversations, newestConversationId, children, showFriends, paddingTop, requests, numRequests } = this.props;
        const { coloredNavbar, hideOnlineFriends } = this.state;
        const navbarStyle = coloredNavbar ? { backgroundColor: '#8C5667' } : {};
        const className = hideOnlineFriends ? 'full' : '';

        return (
            <div id="content-container">
                <ReactResizeDetector handleWidth onResize={this.onResize} refreshMode="throttle" refreshRate={200} />
                <div id="main-content" className={className}>
                    <div style={{ paddingTop }}>
                        <Navbar fixedTop style={navbarStyle}>
                            <Navbar.Header>
                                <Navbar.Brand>
                                    <Link to="/">Socialize</Link>
                                </Navbar.Brand>
                            </Navbar.Header>

                            <Nav>
                                <LinkContainer to={`/messages/${newestConversationId || 'new'}`}><NavItem><Glyphicon glyph="inbox" /> <Badge>{numUnreadConversations}</Badge></NavItem></LinkContainer>
                            </Nav>

                            <Dropdown id="menu-nav-dropdown" >
                                <Dropdown.Toggle noCaret bsStyle="link">
                                    <Glyphicon glyph="user" />
                                    <Badge>{numRequests}</Badge>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {requests && requests.length > 0 ?
                                        requests.map(request => <RequestItem key={request._id} request={request} />) :
                                        <div className="request-item">
                                            <p className="no-requests text-danger">No Requests</p>
                                        </div>
                                    }
                                </Dropdown.Menu>
                            </Dropdown>

                            <Nav pullRight>
                                <NavDropdown title={user.username} id="user-menu">
                                    <LinkContainer to={`/profile/${user.username}`}>
                                        <MenuItem>My Profile</MenuItem>
                                    </LinkContainer>
                                    {user.friendCount > 0 && <MenuItem onClick={this.handleShow}>Friends</MenuItem>}
                                    <MenuItem divider />
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </NavDropdown>
                            </Nav>
                        </Navbar>
                        {children}
                        { showFriends && <FriendsList show={showFriends} handleHide={this.handleHide} /> }
                    </div>
                </div>
                {!hideOnlineFriends && <OnlineFriends user={user} />}
            </div>
        );
    }
}

MainHeader.propTypes = {
    user: PropTypes.instanceOf(User),
    showFriends: PropTypes.bool,
    numUnreadConversations: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    numRequests: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    requests: PropTypes.arrayOf(PropTypes.instanceOf(Request)),
    newestConversationId: PropTypes.string,
    children: PropTypes.node,
    paddingTop: PropTypes.string,
};

MainHeader.defaultProps = {
    paddingTop: '80px',
};

const MainHeaderContainer = withTracker(({ user, params, location: { query } }) => {
    Meteor.subscribe('socialize.friendRequests', {}).ready();
    Meteor.subscribe('unreadConversations').ready();

    const requests = user.friendRequests().fetch();
    const latestConversation = LatestConversationCollection.findOne();
    const newestConversationId = params.conversationId || (latestConversation && latestConversation.conversationId);
    const numUnreadConversations = user.numUnreadConversations() || '';
    return {
        user,
        numUnreadConversations,
        newestConversationId,
        requests,
        numRequests: requests.length || '',
        showFriends: !!query.showFriends,
    };
})(MainHeader);

export default MainHeaderContainer;
