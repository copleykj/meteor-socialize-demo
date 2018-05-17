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
        const { value } = this.composer.textarea;
        if (value) {
            user.feed().addPost(value);
            this.composer.reset();
        }
    }
    render() {
        return (
            <div id="post-composer">
                <ComposerTextArea
                    rows="1"
                    getRef={(composer) => { this.composer = composer; }}
                    placeholder="Enter your post.."
                    onSend={this.addPost}
                />
                <Button onClick={this.addPost} className="pull-right" bsStyle="link" bsSize="small">Add Post</Button>
            </div>
        );
    }
}
