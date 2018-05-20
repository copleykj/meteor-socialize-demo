import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { User } from 'meteor/socialize:user-model';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import plural from 'plural';

import LoginPage from './pages/Login/Login.jsx';

plural.monkeyPatch();

class App extends Component {
    componentDidMount() {
        const { user } = this.props;

        this.newConvoSound.volume = 0.5;
        this.newRequestSound.volume = 0.25;

        user.unreadConversations().observeChanges({
            added: () => {
                if (window.convosReady) {
                    this.newConvoSound && this.newConvoSound.play().catch(() => {});
                }
            },
        });

        user.friendRequests().observeChanges({
            added: () => {
                if (window.requestsReady) {
                    this.newRequestSound && this.newRequestSound.play().catch(() => {});
                }
            },
        });
    }
    render() {
        const { children, ...props } = this.props;
        return (
            <div>
                <audio ref={(ref) => { this.newConvoSound = ref; }} preload="auto" >
                    <source src="blip.mp3" type="audio/mpeg" />
                </audio>
                <audio ref={(ref) => { this.newRequestSound = ref; }} preload="auto">
                    <source src="harp.mp3" type="audio/mpeg" />
                </audio>
                {props.user ? children && React.cloneElement(children, { ...props }) : <LoginPage />}
            </div>
        );
    }
}

App.propTypes = {
    user: PropTypes.instanceOf(User),
    children: PropTypes.node,
};

const AppContainer = withTracker(() => ({
    user: Meteor.user(),
}))(App);

export default AppContainer;
