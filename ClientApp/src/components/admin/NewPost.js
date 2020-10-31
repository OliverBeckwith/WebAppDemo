import React, { Component } from 'react';

export class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            successful: false,
            post: {
                title: '',
                content: ''
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        let post = this.state.post;
        post[event.target.name] = event.target.value;
        this.setState({ post: post });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const response = await fetch("api/posts/new", {
            method: 'POST',
            body: JSON.stringify(this.state.post),
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(response);
        this.setState({ successful: true });
    }

    render() {
        let body;
        if (this.state.successful) {
            body = (
                <div>
                    <p>New post created successfully!</p>
                </div>
            );
        }
        else {
            body = (
                <div>
                    <form method="POST" onSubmit={this.handleSubmit}>
                        <label>Title:</label>
                        <input type="text" name="title" value={this.state.title} onChange={this.handleChange} />

                        <label>Content:</label>
                        <input type="text" name="content" value={this.state.content} onChange={this.handleChange} />

                        <input type="submit" value="Submit" />
                    </form>
                </div>
            );
        }

        return (
            <div>
                <h2>New Post</h2>
                {body}
            </div>
        )
    }
}