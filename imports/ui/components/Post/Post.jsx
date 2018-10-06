import { Meteor } from 'meteor/meteor';
import { Comment } from 'meteor/socialize:commentable';
import { User } from 'meteor/socialize:user-model';
import { Post } from 'meteor/socialize:postable';
import { withTracker } from 'meteor/react-meteor-data';
import { Glyphicon, Button, ButtonGroup, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';

import UserAvatar from '../UserAvatar/UserAvatar.jsx';
import PostComment from '../PostComment/PostComment.jsx';
import ComposerTextArea from '../ComposerTextArea/ComposerTextArea.jsx';
import Markdown from '../Markdown/Markdown.jsx';

class PostComponent extends Component {
    addComment = () => {
        const { post } = this.props;
        const { value } = this.composer.textarea;
        if (value) {
            post.addComment(value);
            this.composer.reset();
        }
    }
    render() {
        const { user, post, poster, comments, likedByUser } = this.props;
        let likeIcon = 'heart-empty';
        let textClass = '';

        if (likedByUser) {
            likeIcon = 'heart';
            textClass = 'text-danger';
        }

        const { commentCount, likeCount } = post;
        return (
            <div className="post-container">
                <div className="post">
                    <div className="header">
                        <UserAvatar user={poster} size={50} showStatus />
                        <section>
                            <p className="username">
                                <Link to={`/profile/${poster.username}`}>{poster.username}</Link>
                            </p>
                            <p className="time-ago"><TimeAgo date={post.createdAt} minPeriod={10} /></p>
                        </section>
                        { post.canRemove() &&
                            <DropdownButton title={<Glyphicon glyph="option-vertical" />} id={`dropdown-delete-${post._id}`} bsStyle="link" bsSize="small" noCaret>
                                <MenuItem onClick={() => post.remove()}><Glyphicon glyph="trash" /> Delete</MenuItem>
                            </DropdownButton>
                        }
                    </div>
                    <div className="body">
                        <Markdown
                            source={post.body}
                        />
                    </div>
                    <div className="footer">
                        <small>
                            {`${likeCount} ${'like'.plural(likeCount)}`} - {`${commentCount} ${'comment'.plural(commentCount)}`}
                        </small>
                        <ButtonToolbar>
                            <ButtonGroup>
                                <Button bsSize="xsmall" bsStyle="link" onClick={() => { likedByUser ? post.unlike() : post.like(); }}>
                                    <Glyphicon className={textClass} glyph={likeIcon} />
                                </Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                    </div>
                </div>
                <div className="comments-container">
                    {
                        comments.map(PostComment)
                    }

                    <form>
                        <div>
                            <UserAvatar
                                user={user}
                                size={40}
                            />
                        </div>
                        <div className="input-container">
                            <ComposerTextArea
                                rows="1"
                                className="form-control input-sm"
                                getRef={(composer) => { this.composer = composer; }}
                                placeholder="Enter your comment.."
                                onSend={this.addComment}
                            />
                        </div>
                        <Button
                            bsStyle="link"
                            bsSize="xsmall"
                            onClick={this.addComment}
                        >
                            <Glyphicon glyph="send" />
                        </Button>
                    </form>

                </div>
            </div>
        );
    }
}

PostComponent.propTypes = {
    post: PropTypes.instanceOf(Post),
    poster: PropTypes.instanceOf(User),
    user: PropTypes.instanceOf(User),
    comments: PropTypes.arrayOf(PropTypes.instanceOf(Comment)),
    likedByUser: PropTypes.bool,
};

const PostComponentContainer = withTracker(({ post }) => ({
    post,
    poster: post.poster(),
    user: Meteor.user(),
    comments: post.comments({ limit: 1 }).fetch(),
    likedByUser: post.isLikedBy(Meteor.user()),
}))(PostComponent);

export default PostComponentContainer;
