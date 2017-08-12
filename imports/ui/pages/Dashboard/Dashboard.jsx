import React from 'react';
import { User } from 'meteor/socialize:user-model';
import MainHeader from '../../components/MainHeader/MainHeader.jsx';


const Dashboard = ({ user }) => (
    <div id="page-dashboard">
        {MainHeader(user)}
    </div>
);

Dashboard.propTypes = {
    user: React.PropTypes.instanceOf(User),
};

export default Dashboard;
