import { Meteor } from 'meteor/meteor';
import { Comment } from 'meteor/socialize:commentable';
import { User } from 'meteor/socialize:user-model';
import { Post } from 'meteor/socialize:postable';
import { Well, Clearfix, Glyphicon, Button, ButtonGroup, ButtonToolbar, FormGroup } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React from 'react';

import PostComment from '../PostComment/PostComment.jsx';

const PostComponent = ({ post, poster, comments, commentCount, likeCount, likedByUser }) => {
    let likeIcon = 'heart-empty';
    let textClass = '';
    let ta;

    if (likedByUser) {
        likeIcon = 'heart';
        textClass = 'text-danger';
    }
    return (
        <Well style={{ overflow: 'hidden' }}>
            <img className="pull-left" src="http://via.placeholder.com/60x60" alt="placeholder" />
            <div style={{ marginLeft: '75px' }}>
                <p style={{ marginBottom: '4px', marginTop: '-5px' }} className="text-info">{poster.username}</p>
                <p>{post.body}</p>
                <div className="text-warning">
                    <small className="pull-left">
                        {`${likeCount} ${'like'.plural(likeCount)}`} - {`${commentCount} ${'comment'.plural(commentCount)}`}
                    </small>
                    <ButtonToolbar className="pull-right">
                        <ButtonGroup>
                            <Button bsSize="xsmall" onClick={() => { likedByUser ? post.unlike() : post.like(); }}>
                                <Glyphicon className={textClass} glyph={likeIcon} />
                            </Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
            </div>
            <Clearfix />
            <div style={{ borderTop: '1px solid #3a3a3a', marginTop: '10px', paddingTop: '10px' }}>
                {
                    comments.map(PostComment)
                }

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        post.addComment(ta.value);
                        ta.value = '';
                    }}
                    style={{ marginTop: '10px' }}
                >
                    <FormGroup>
                        <img className="pull-left" src="http://via.placeholder.com/40x40" alt="placeholder" />
                        <div style={{ marginLeft: '60px' }}>
                            <textarea style={{ maxWidth: '100%' }} className="form-control input-sm" ref={(ref) => { ta = ref; }} placeholder="Enter your comment.." />
                        </div>
                    </FormGroup>
                    <Button className="pull-right" bsStyle="primary" bsSize="xsmall" type="submit">Add Comment</Button>
                    <Clearfix />
                </form>

            </div>
        </Well>
    );
};

PostComponent.propTypes = {
    post: PropTypes.instanceOf(Post),
    poster: PropTypes.instanceOf(User),
    comments: PropTypes.arrayOf(PropTypes.instanceOf(Comment)),
    commentCount: PropTypes.number,
    likeCount: PropTypes.number,
    likedByUser: PropTypes.bool,
};

const PostComponentContainer = createContainer(({ post }) => ({
    post,
    poster: post.poster(),
    comments: post.comments().fetch(),
    commentCount: post.commentCount(),
    likeCount: post.likeCount(),
    likedByUser: post.isLikedBy(Meteor.user()),
}), PostComponent);

export default PostComponentContainer;
