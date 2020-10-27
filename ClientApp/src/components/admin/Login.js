import React, { Component } from 'react';
import { hash_sha512 } from "../../core";

export class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
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
        let response = await fetch("api/admin/salt/" + this.state.id, {
            method: 'GET',
        });
        const salt = await response.text();
        const hashed = hash_sha512(this.state.password, salt);
        response = await fetch("api/admin/login/"+this.state.id, {
            method: 'POST',
            body: JSON.stringify(hashed),
            headers: { 'Content-Type': 'application/json' },
        });
    }

    render() {
        return (
            <div>
                <h2>Login</h2>
                <form method="POST" onSubmit={this.handleSubmit}>
                    <label>ID: </label>
                    <input name="id" value={this.state.id} onChange={this.handleChange} />

                    <label>Password: </label>
                    <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                    <input type="submit" value="Login" />
                </form>
            </div>
        );
    }
}
