import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { User } from 'meteor/socialize:user-model';

import React from 'react';
import PropTypes from 'prop-types';

import LoginPage from './pages/Login/Login.jsx';

const App = ({ children, ...props }) => (
    props.user ? children && React.cloneElement(children, { ...props }) : <LoginPage />
);

App.propTypes = {
    user: PropTypes.instanceOf(User),
    children: PropTypes.node,
};

const AppContainer = createContainer(() => ({
    user: Meteor.user(),
}), App);

export default AppContainer;
