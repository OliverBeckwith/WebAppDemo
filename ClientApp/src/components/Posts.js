import React, { Component } from 'react';

export class Posts extends React.Component {

    constructor(props) {
        super(props);
        this.state = { posts: [], loading: true };
        this.getPosts();
    }

    async getPosts() {
        const response = await fetch("api/posts");
        const posts = await response.json();
        this.setState({ loading: false, posts: posts });
    }

    render() {

        let body;

        if (this.state.loading) {
            body = (
                <p>Loading</p>
            );
        }
        else {
            body = (
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Content</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.posts.map(post =>
                            <tr key={post.id}>
                                <td>{post.posted}</td>
                                <td>{post.title}</td>
                                <td>{post.author}</td>
                                <td>{post.content}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            );
        }

        return (
            <div>
                <h1>Posts</h1>
                {body}
            </div>
        );
    }
}