import { Request } from 'meteor/socialize:requestable';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import UserAvatar from '../../components/UserAvatar/UserAvatar.jsx';

class RequestItem extends Component {
    static propTypes = {
        request: PropTypes.instanceOf(Request),
    }
    state = {};
    render() {
        const { request } = this.props;
        const requester = request.requester();
        return (
            <div className="request-item">
                <UserAvatar className="avatar" size={50} user={requester} />
                <div>
                    <p className="text-primary">{requester.username} would like to be friends</p>
                    <div className="actions">
                        <Button bsStyle="link" bsSize="small" className="text-danger" onClick={() => request.accept()}>Accept</Button>
                        <Button bsStyle="link" bsSize="small" className="text-primary" onClick={() => request.deny()}>Deny</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default RequestItem;
