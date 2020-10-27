import React, { Component } from 'react';
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
        console.log(data);
        let response = await fetch("api/admin/createadmin", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(response)
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
                    <label>Password: </label>
                    <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                    <input type="submit" value="Create" />
                </form>
            );
        }
        else {
            body = (
                <div>
                    <p>Your unique id is {this.state.id}</p>
                    <em color="red">Remember this id or you won't be able to log in!</em>
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
