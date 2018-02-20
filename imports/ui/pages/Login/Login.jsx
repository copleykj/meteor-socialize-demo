import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { User } from 'meteor/socialize:user-model';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Grid, Row, Col, Button, Collapse } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import AutoField from 'uniforms-bootstrap3/AutoField';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import ErrorsField from 'uniforms-bootstrap3/ErrorsField';


const LoginSchema = new SimpleSchema({
    usernameOrEmail: {
        type: String,
    },
    password: {
        type: String,
    },
});

const RegisterSchema = new SimpleSchema({
    username: {
        type: String,
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
    },
    password: {
        type: String,
    },
});

export default class LoginPage extends Component {
    static propTypes = {
        user: PropTypes.instanceOf(User),
    }

    state = { signUp: false, loginError: null };

    componentWillMount() {
        if (this.props.user) {
            browserHistory.replace('/');
        }
    }

    handleSubmit = (doc) => {
        this.setState({ loginError: null });
        if (this.state.signUp) {
            Accounts.createUser({ ...doc }, (err) => {
                if (!err) {
                    browserHistory.replace('/');
                } else {
                    this.setState({ loginError: new Error(err.reason) });
                }
            });
        } else {
            Meteor.loginWithPassword(doc.usernameOrEmail, doc.password, (err) => {
                if (!err) {
                    browserHistory.replace('/');
                } else {
                    this.setState({ loginError: new Error('Invalid username or password') });
                }
            });
        }
    }

    switchForm = (event) => {
        event.preventDefault();
        this.setState({ signUp: !this.state.signUp, loginError: null });
    }

    render() {
        const { signUp, loginError } = this.state;
        return (
            <div id="login-page">
                <Grid>
                    <Row>
                        <Col xs={6} xsOffset={3}>
                            <div className="form-container">
                                <img src="meteor-logo.svg" alt="" />
                                <h1>Socialize</h1>
                                { signUp &&
                                    <AutoForm showInlineError schema={RegisterSchema} onSubmit={this.handleSubmit} error={loginError}>
                                        <AutoField name="username" placeholder label={false} />
                                        <AutoField name="email" placeholder label={false} />
                                        <AutoField name="password" type="password" placeholder label={false} />
                                        <Collapse in={!!loginError}>
                                            <ErrorsField />
                                        </Collapse>
                                        <Button type="submit" bsStyle="primary" block>Register</Button>
                                        <p style={{ marginTop: '1.2em' }}>Already have an account? <a href="#" onClick={this.switchForm}>Log In</a></p>
                                    </AutoForm>
                                }
                                { !signUp &&
                                    <AutoForm showInlineError schema={LoginSchema} onSubmit={this.handleSubmit} error={loginError}>
                                        <AutoField name="usernameOrEmail" placeholder="Username or Email" label={false} />
                                        <AutoField name="password" type="password" placeholder label={false} />
                                        <Collapse in={!!loginError}>
                                            <ErrorsField />
                                        </Collapse>
                                        <Button type="submit" bsStyle="primary" block>Log In</Button>
                                        <p style={{ marginTop: '1.2em' }}>Don&apos;t have an account? <a href="#" onClick={this.switchForm}>Register</a></p>
                                    </AutoForm>
                                }
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}
