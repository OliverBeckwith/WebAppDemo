import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { hash_sha512, new_hashsalt } from "../../core";

export class CreateAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        let data = new_hashsalt(this.state.password);
        let response = await fetch("api/admin/createadmin", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const id = await response.text();
            this.setState({ id: id });
        }
    }

    render() {
        let body;
        if (this.state.id === undefined) {
            body = (
                <form method="POST" onSubmit={this.handleSubmit}>
                    <Row>
                        <Col sm="2">
                            <label>Password: </label>
                        </Col>
                        <Col sm="6">
                            <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="auto">
                            <input type="submit" value="Create" />
                        </Col>
                    </Row>
                </form>
            );
        }
        else {
            body = (
                <div>
                    <p>Your unique id is {this.state.id}</p>
                    <em style={{ color: "red" }}>Remember this id or you won't be able to log in!</em>
                </div>
            );
        }
        return (
            <div>
                <h2>Login</h2>
                {body}
            </div>
        );
    }
}
