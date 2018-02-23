import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import { User } from 'meteor/socialize:user-model';

import ComposerTextArea from '../ComposerTextArea/ComposerTextArea.jsx';

export default class extends Component {
    static propTypes = {
        user: PropTypes.instanceOf(User),
    }
    addPost = () => {
        const { user } = this.props;
        user.feed().addPost(this.ta.value);
        this.ta.value = '';
    }
    render() {
        return (
            <div id="post-composer">
                <ComposerTextArea
                    rows="1"
                    className="form-control input-sm"
                    getRef={(ref) => { this.ta = ref; }}
                    placeholder="Enter your post.."
                    onSend={this.addPost}
                />
                <Button onClick={this.addPost} className="pull-right" bsStyle="link" bsSize="small">Add Post</Button>
            </div>
        );
    }
}
