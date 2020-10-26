import React, { Component } from 'react';

export class NewPost extends React.Component {
    render() {
        return (<NewPostForm />)
    }
}

class NewPostForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            successful: false,
            post: {
                title: '',
                content: '',
                author: ''
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
        await fetch("api/posts/new", {
            method: 'POST',
            body: JSON.stringify(this.state.post),
            headers: { 'Content-Type': 'application/json' },
        });
        this.setState({ successful: true });
    }

    render() {
        if (this.state.successful) {
            return (
                <div>
                    <p>New post created successfully!</p>
                    {JSON.stringify(this.state)}
                </div>
            );
        }
        return (
            <div>
                <form method="POST" onSubmit={this.handleSubmit}>
                    <label>Title:</label>
                    <input type="text" name="title" value={this.state.title} onChange={this.handleChange} />

                    <label>Content:</label>
                    <input type="text" name="content" value={this.state.content} onChange={this.handleChange} />

                    <label>Author:</label>
                    <input type="text" name="author" value={this.state.author} onChange={this.handleChange} />

                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}