import React from 'react';
import { Well, Button, FormGroup, Clearfix } from 'react-bootstrap';

export default (user) => {
    let ta;
    return (
        <Well>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    user.feed().addPost(ta.value);
                    ta.value = '';
                }}
            >
                <FormGroup>
                    <textarea style={{ maxWidth: '100%' }} className="form-control input-sm" ref={(ref) => { ta = ref; }} placeholder="Enter your post.." />
                </FormGroup>
                <Button className="pull-right" bsStyle="primary" bsSize="small" type="submit">Add Post</Button>
                <Clearfix />
            </form>
        </Well>
    );
};
