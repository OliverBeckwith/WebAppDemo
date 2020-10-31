import React, { Component } from 'react';
import { checkAdmin } from "../core";

export class Posts extends React.Component {

    constructor(props) {
        super(props);
        this.state = { posts: [], loading: true, admin: false };
        this.getPosts();
        this.getAdmin();
    }

    async getPosts() {
        const response = await fetch("api/posts");
        const posts = await response.json();
        this.setState({ loading: false, posts: posts });
    }

    async getAdmin() {
        const isAdmin = await checkAdmin();
        this.setState({ admin: isAdmin });
    }

    truncate(text, length) {
        return text.length > length
            ? text.substring(0, length) + "..."
            : text;
    }

    render() {

        let body;

        if (this.state.loading) {
            body = (
                <div>
                    <p>Loading</p>
                </div>
            );
        }
        else {
            let posts;
            if (this.state.posts && this.state.posts.length > 0) {
                posts = this.state.posts.map(post =>
                    <tr className="postlist-row" onClick={() => {window.location = `/post/${post.id}`}} key={post.id}>
                        <td>{new Date(post.posted).toLocaleString()}</td>
                        <td>{this.truncate(post.title, 25)}</td>
                        <td>{this.truncate(post.content, 25)}</td>
                        <td><a href={`/post/${post.id}`}>View</a></td>
                        {this.state.admin
                            ? <td><a href={"/admin/post/edit/" + post.id}><i class="fas fa-edit"></i></a></td>
                            : ""
                        }
                    </tr>
                );
            }
            else {
                posts = (
                    <p>No Posts to show</p>
                );
            }

            body = (
                <div>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Time Posted</th>
                                <th>Title</th>
                                <th>Content</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div>
                <h2>Posts</h2>
                {body}
            </div>
        );
    }
}