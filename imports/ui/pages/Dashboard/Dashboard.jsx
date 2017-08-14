import React from 'react';
import PropTypes from 'prop-types';

import { User } from 'meteor/socialize:user-model';

import MainHeader from '../../components/MainHeader/MainHeader.jsx';


const Dashboard = ({ user }) => (
    <div id="page-dashboard">
    <div id="page-dashboard" style={{ paddingTop: '80px' }}>
        {MainHeader(user)}
    </div>
);

Dashboard.propTypes = {
    user: PropTypes.instanceOf(User),
};

export default Dashboard;
