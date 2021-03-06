import React, { Component } from 'react';
import { Loader } from '../Loader';
import { Redirect } from 'react-router-dom';
import { hash_sha512 } from "../../core";
import { Row, Col } from 'reactstrap';

export class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            password: '',
            success: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        let response = await fetch("api/admin/salt/" + this.state.id, {
            method: 'GET',
        });
        const salt = await response.text();
        const hashed = hash_sha512(this.state.password, salt);
        response = await fetch("api/admin/login/" + this.state.id, {
            method: 'POST',
            body: JSON.stringify(hashed),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            this.setState({ success: true });
        }
    }

    render() {
        if (this.state.success) {
            return <Loader onLoadGoto="/admin" refresh={true} />
        }

        let body = (
            <form method="POST" onSubmit={this.handleSubmit}>
                <Row>
                    <Col sm="2">
                        <label>ID: </label>
                    </Col>
                    <Col sm="6">
                        <input style={{ width: "100%" }} name="id" value={this.state.id} onChange={this.handleChange} />
                    </Col>
                </Row>
                <Row>
                    <Col sm="2">
                        <label>Password: </label>
                    </Col>
                    <Col sm="6">
                        <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                    </Col>
                </Row>
                <Row><Col sm="auto">
                    <input type="submit" value="Login" />
                </Col></Row>
            </form>
        );

        return (
            <div>
                <h2>Login</h2>
                {body}
            </div>
        );
    }
}
