import React, { Component } from 'react';

export class EditPost extends React.Component {
    render() {
        return (<EditPostForm />)
    }
}

class EditPostForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saved: false,
            deleted: false,
            post: props.post
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleChange(event) {
        let post = this.state.post;
        post[event.target.name] = event.target.value;
        this.setState({ post: post });
    }

    async handleSubmit(event) {
        event.preventDefault();
        await fetch("api/admin/post", {
            method: 'PUT',
            body: JSON.stringify(this.state.post),
            headers: { 'Content-Type': 'application/json' },
        });
        this.setState({ saved: true });
    }

    handleDelete(event) {
        fetch("api/admin/post", {
            method: 'DELETE',
            body: JSON.stringify(this.state.post.id),
            headers: { 'Content-Type': 'application/json' },
        });
        this.setState({ deleted: true });
    }

    render() {
        let body;
        if (this.state.deleted) {
            body = (
                <div>
                    <p>Post deleted successfully!</p>
                </div>
            );
        }
        else if (this.state.saved) {
            body = (
                <div>
                    <p>Post saved successfully!</p>
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

                        <label>Author:</label>
                        <input type="text" name="author" value={this.state.author} onChange={this.handleChange} />

                        <input type="submit" value="Submit" />
                    </form>
                    <button>Delete</button>
                </div>
            );
        }

        return (
            <div>
                <h2>Edit Post</h2>
                {body}
            </div>
        );
    }
}