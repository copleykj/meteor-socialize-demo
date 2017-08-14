import { Meteor } from 'meteor/meteor';
import React from 'react';
import { ButtonToolbar, ButtonGroup, Button, Glyphicon, Clearfix } from 'react-bootstrap';

const PostComment = (comment) => {
    const likedByUser = comment.isLikedBy(Meteor.user());
    let likeIcon = 'heart-empty';
    let textClass = '';

    if (likedByUser) {
        likeIcon = 'heart';
        textClass = 'text-danger';
    }
    return (
        <div style={{ borderBottom: '1px solid #3a3a3a', margin: '3px 0', padding: '2px 0' }} key={comment._id}>
            <div style={{ marginLeft: '20px' }}>
                <img className="pull-left" src="http://via.placeholder.com/40x40" alt="placeholder" />
                <div style={{ marginLeft: '60px' }}>
                    <small className="pull-right"><Glyphicon className={textClass} glyph={likeIcon} onClick={() => { likedByUser ? comment.unlike() : comment.like(); }} /></small>
                    <p style={{ marginBottom: '2px' }} className="text-info">{comment.user().username}</p>
                    <p style={{ marginBottom: '0', whiteSpace: 'pre-line', wordWrap: 'break-word' }}>{comment.body}</p>
                    <div>
                        <small className="pull-right text-warning">
                            {`${comment.likeCount()} ${'like'.plural(comment.likeCount())}`}
                        </small>
                        <Clearfix />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostComment;
