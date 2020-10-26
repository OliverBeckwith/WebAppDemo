import React, { Component } from 'react';

export class ViewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = { post: null, loading: true };
    }

    async getPost(id) {
        const response = await fetch("api/posts/" + id);
        const post = await response.json();
        this.setState({ loading: false, post: post });
    }

    render() {
        if (this.state.loading) {
            return (
                <div>
                    <p>Loading</p>
                </div>
            );
        }
        else {
            return (
                <div>
                    <h1>{this.state.post.title}</h1>
                    <h2>Posted by: {this.state.post.author}</h2>
                    <h3>Posted at: {this.state.post.posted}</h3>
                    <p>{this.state.post.content}</p>
                </div>
            );
        }
    }
}