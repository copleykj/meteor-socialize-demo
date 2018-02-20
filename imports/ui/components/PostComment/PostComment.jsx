import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router';
import { Glyphicon, Clearfix } from 'react-bootstrap';

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
        <div style={{ borderBottom: '1px solid #3a3a3a', margin: '3px 0', padding: '2px 0' }} key={comment._id}>
            <div>
                <div className="pull-left">
                    <UserAvatar
                        user={user}
                        size={40}
                    />
                </div>
                <div style={{ marginLeft: '50px' }}>
                    <small className="pull-right"><Glyphicon className={textClass} glyph={likeIcon} onClick={() => { likedByUser ? comment.unlike() : comment.like(); }} /></small>
                    <p style={{ marginBottom: '2px' }} className="text-info">
                        <Link to={`/profile/${username}`}>{username}</Link>
                    </p>
                    <p style={{ marginBottom: '0', whiteSpace: 'pre-line', wordWrap: 'break-word' }}>{comment.body}</p>
                    <div>
                        <small className="pull-right text-warning">
                            {`${comment.likeCount} ${'like'.plural(comment.likeCount)}`}
                        </small>
                        <Clearfix />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostComment;
