import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { User } from 'meteor/socialize:user-model';

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import plural from 'plural';

import LoginPage from './pages/Login/Login.jsx';

import Dashboard from '../ui/pages/Dashboard/Dashboard.jsx';
import Messages from '../ui/pages/Messages/Messages.jsx';
import UserProfile from '../ui/pages/UserProfile/UserProfile.jsx';

plural.monkeyPatch();

const SecuredPage = (props) => {
    const { Component, ...restProps } = props;
    if (props.user) {
        return (<Component {...restProps} />);
    }
    return (<LoginPage />);
};

SecuredPage.propTypes = {
    user: PropTypes.instanceOf(User),
    Component: PropTypes.func,
};

const App = props => (
    <>
        <Route path="/" exact render={routerProps => <SecuredPage Component={Dashboard} {...props} {...routerProps} />} />
        <Route path="/login" component={LoginPage} />
        <Route exact path="/profile/:username" render={routerProps => <SecuredPage Component={UserProfile} {...props} {...routerProps} />} />
        <Route path="/messages/:conversationId" render={routerProps => <SecuredPage Component={Messages} {...props} {...routerProps} />} />
        <Route path="/messages" render={routerProps => <SecuredPage Component={Messages} {...props} {...routerProps} />} />
    </>
);

const AppContainer = withTracker(() => ({
    user: Meteor.user(),
}))(App);

export default AppContainer;
