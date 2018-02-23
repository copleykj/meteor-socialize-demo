import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router';
import { Glyphicon, Button } from 'react-bootstrap';
import TimeAgo from 'react-timeago';

import UserAvatar from '../UserAvatar/UserAvatar.jsx';

const PostComment = (comment) => {
    const likedByUser = comment.isLikedBy(Meteor.user());
    const user = comment.user();
    const username = user.username;
    let likeIcon = 'heart-empty';
    let textClass = '';

    if (likedByUser) {
        likeIcon = 'heart';
        textClass = 'text-danger';
    }
    return (
        <div className="post-comment" key={comment._id}>
            <div className="header">
                <UserAvatar
                    user={user}
                    size={40}
                />
                <section>
                    <p className="username">
                        <Link to={`/profile/${username}`}>{username}</Link>
                    </p>
                    <p className="time-ago"><TimeAgo date={comment.createdAt} minPeriod={10} /></p>
                </section>
            </div>
            <p className="body">{comment.body}</p>
            <div className="footer">
                <small>
                    {`${comment.likeCount} ${'like'.plural(comment.likeCount)}`}
                </small>
                <Button bsSize="xsmall" bsStyle="link" onClick={() => { likedByUser ? comment.unlike() : comment.like(); }} >
                    <Glyphicon className={textClass} glyph={likeIcon} />
                </Button>
            </div>
        </div>
    );
};

export default PostComment;
