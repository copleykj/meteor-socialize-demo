import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { User } from 'meteor/socialize:user-model';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Grid, Row, Col, Button, Panel } from 'react-bootstrap';
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
        user: React.PropTypes.instanceOf(User),
    }

    state = { signUp: false };

    componentWillMount() {
        if (this.props.user) {
            browserHistory.replace('/');
        }
    }

    handleSubmit = (doc) => {
        if (this.state.signUp) {
            Accounts.createUser({ ...doc }, (err) => {
                if (!err) {
                    browserHistory.replace('/');
                }
            });
        }
        Meteor.loginWithPassword(doc.usernameOrEmail, doc.password, (err) => {
            if (!err) {
                browserHistory.replace('/');
            }
        });
    }

    render() {
        const { signUp } = this.state;
        return (
            <Grid>
                <Row>
                    <Col xs={6} xsOffset={3}>
                        <h1 className="text-center" style={{ marginTop: '200px' }}>Socialize</h1>
                        <Panel header={signUp ? 'Register Account' : 'Login'} bsStyle="info">
                            { signUp &&
                                <AutoForm schema={RegisterSchema} onSubmit={this.handleSubmit}>
                                    <AutoField name="username" />
                                    <AutoField name="email" />
                                    <AutoField name="password" type="password" />
                                    <Button type="submit" bsStyle="info">Register</Button>
                                    <ErrorsField />
                                    <p style={{ marginTop: '1.2em' }}>Already have an account? <a href="#" onClick={(event) => { event.preventDefault(); this.setState({ signUp: false }); }}>Log In</a></p>
                                </AutoForm>
                            }
                            { !signUp &&
                                <AutoForm schema={LoginSchema} onSubmit={this.handleSubmit}>
                                    <AutoField name="usernameOrEmail" label="Username or Email" />
                                    <AutoField name="password" type="password" />
                                    <Button type="submit" bsStyle="info">Log In</Button>
                                    <ErrorsField />
                                    <p style={{ marginTop: '1.2em' }}>Don&apos;t have an account? <a href="#" onClick={(event) => { event.preventDefault(); this.setState({ signUp: true }); }}>Register</a></p>
                                </AutoForm>
                            }
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
