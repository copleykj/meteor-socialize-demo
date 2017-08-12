import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { User } from 'meteor/socialize:user-model';

import React from 'react';

import LoginPage from './pages/Login/Login.jsx';

const App = ({ children, ...props }) => (
    props.user ? children && React.cloneElement(children, { ...props }) : <LoginPage />
);

App.propTypes = {
    user: React.PropTypes.instanceOf(User),
    children: React.PropTypes.node,
};

const AppContainer = createContainer(() => ({
    user: Meteor.user(),
}), App);

export default AppContainer;
