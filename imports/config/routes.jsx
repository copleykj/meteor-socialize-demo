import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../ui/App.jsx';
import Dashboard from '../ui/pages/Dashboard/Dashboard.jsx';
import Login from '../ui/pages/Login/Login.jsx';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={Dashboard} />
        <Route path="/login" component={Login} />
    </Route>
);
