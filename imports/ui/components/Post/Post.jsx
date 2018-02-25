import { Meteor } from 'meteor/meteor';
import { Comment } from 'meteor/socialize:commentable';
import { User } from 'meteor/socialize:user-model';
import { Post } from 'meteor/socialize:postable';
import { withTracker } from 'meteor/react-meteor-data';
import { Glyphicon, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';
import TimeAgo from 'react-timeago';

import UserAvatar from '../UserAvatar/UserAvatar.jsx';
import PostComment from '../PostComment/PostComment.jsx';
import ComposerTextArea from '../ComposerTextArea/ComposerTextArea.jsx';

class PostComponent extends Component {
    addComment = (bodyText) => {
        const { post } = this.props;
        post.addComment(bodyText);
        this.ta.value = '';
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
                        <Link to={`/profile/${poster.username}`}>
                            <UserAvatar user={poster} size={50} />
                        </Link>
                        <section>
                            <p className="username">
                                <Link to={`/profile/${poster.username}`}>{poster.username}</Link>
                            </p>
                            <p className="time-ago"><TimeAgo date={post.createdAt} minPeriod={10} /></p>
                        </section>
                    </div>
                    <p className="body">{post.body}</p>
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
                                getRef={(ref) => { this.ta = ref; }}
                                placeholder="Enter your comment.."
                                onSend={this.addComment}
                            />
                        </div>
                        <Button
                            bsStyle="link"
                            bsSize="xsmall"
                            onClick={() => {
                                this.addComment(this.ta.value);
                            }}
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
    comments: post.comments().fetch(),
    likedByUser: post.isLikedBy(Meteor.user()),
}))(PostComponent);

export default PostComponentContainer;
