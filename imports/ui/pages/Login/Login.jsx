import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { User } from 'meteor/socialize:user-model';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Grid, Row, Col, Button, Panel, Collapse } from 'react-bootstrap';
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
            <Grid>
                <Row>
                    <Col xs={6} xsOffset={3}>
                        <h1 className="text-center" style={{ marginTop: '200px' }}>Socialize</h1>
                        <Panel header={signUp ? 'Register Account' : 'Login'} bsStyle="primary">
                            { signUp &&
                                <AutoForm showInlineError schema={RegisterSchema} onSubmit={this.handleSubmit} error={loginError}>
                                    <AutoField name="username" />
                                    <AutoField name="email" />
                                    <AutoField name="password" type="password" />
                                    <Collapse in={!!loginError}>
                                        <ErrorsField />
                                    </Collapse>
                                    <Button type="submit" bsStyle="primary">Register</Button>
                                    <p style={{ marginTop: '1.2em' }}>Already have an account? <a href="#" onClick={this.switchForm}>Log In</a></p>
                                </AutoForm>
                            }
                            { !signUp &&
                                <AutoForm showInlineError schema={LoginSchema} onSubmit={this.handleSubmit} error={loginError}>
                                    <AutoField name="usernameOrEmail" label="Username or Email" />
                                    <AutoField name="password" type="password" />
                                    <Collapse in={!!loginError}>
                                        <ErrorsField />
                                    </Collapse>
                                    <Button type="submit" bsStyle="primary">Log In</Button>
                                    <p style={{ marginTop: '1.2em' }}>Don&apos;t have an account? <a href="#" onClick={this.switchForm}>Register</a></p>
                                </AutoForm>
                            }
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
