import React, { Component } from 'react';
import { useParams } from "react-router-dom";
import { checkAdmin, loadPost } from "../core";

export function ViewPost() {
    let { id } = useParams();

    if (id) {
        return <Post id={id} />
    }
}

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post_id: props.id,
            post: null,
            loadingpost: true,
            comments: null,
            loadingcomments: true,
            admin: false,
            newcomment: {
                content: '',
                author: ''
            }
        };

        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
        this.deleteComment = this.deleteComment.bind(this);

        this.getPost(props.id);
        this.getAdmin();
    }

    async getPost(id) {
        const post = await loadPost(id)
        this.setState({ loadingpost: false, post: post });
        this.loadComments(id);
    }

    async loadComments(postid) {
        const response = await fetch(`api/posts/${postid}/comments`);
        const comments = await response.json();
        this.setState({ loadingcomments: false, comments: comments });
    }

    async getAdmin() {
        const isAdmin = await checkAdmin();
        this.setState({ admin: isAdmin });
    }

    getPostBody() {
        if (this.state.loadingpost) {
            return (
                <div>
                    <h2>Post Loading</h2>
                </div>
            );
        }
        else {
            console.log(this.state.post);
            return (
                <div>
                    <h2>{this.state.post.title}</h2>
                    <em>Posted at: {new Date(this.state.post.posted).toLocaleString()} 
                        {this.state.post.modified != this.state.post.posted
                            ? ` - Last modified at: ${new Date(this.state.post.modified).toLocaleString()}`
                            : null}
                    </em>
                    <p>{this.state.post.content}</p>
                    {this.state.admin
                        ? <a href={`/admin/post/edit/${this.props.id}`}>Edit this post</a>
                        : ""
                    }
                </div>
            );
        }
    }

    getCommentsBody() {
        if (this.state.loadingcomments) {
            return (
                <div>
                    <p>Comments Loading</p>
                </div>
            )
        }
        else {
            let existing;
            if (this.state.comments.length > 0) {
                existing = (
                    <div>
                        {this.state.comments.map(comment =>
                            <div key={comment.id}>
                                <em>At {new Date(comment.commented).toLocaleString()}, <strong>{comment.author}</strong> said:</em>
                                <p>{comment.content}</p>
                                {this.state.admin
                                    ? <a href='#' onClick={(e) => { e.preventDefault(); this.deleteComment(comment.id) }}>Delete</a>
                                    : null
                                }
                            </div>
                        )}
                    </div>
                );
            }
            else {
                existing = (
                    <div>
                        <p>There are no comments</p>
                    </div>
                )
            }
            return (
                <div>
                    <h4>Comments</h4>
                    {existing}
                    <h4>Leave a Comment</h4>
                    <form method="post" onSubmit={this.handleCommentSubmit}>
                        <label>Display Name: </label>
                        <input name="author" value={this.state.newcomment.author} onChange={this.handleCommentChange} />

                        <label>Comment: </label>
                        <input name="content" value={this.state.newcomment.content} onChange={this.handleCommentChange} />

                        <input type="submit" value="Submit" />
                    </form>
                </div>

            )
        }
    }

    handleCommentChange(e) {
        let newcomment = this.state.newcomment;
        newcomment[e.target.name] = e.target.value;
        this.setState({ newcomment: newcomment });
    }

    async handleCommentSubmit(e) {
        e.preventDefault();
        const response = await fetch(`/api/posts/${this.state.post_id}/newcomment`, {
            method: "post",
            body: JSON.stringify(this.state.newcomment),
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(response);
        this.setState({ newcomment: { content: '', author: '' } });
        this.loadComments(this.state.post_id);
    }

    async deleteComment(id) {
        const response = await fetch(`/api/admin/comment`, {
            method: "delete",
            body: JSON.stringify(id),
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(response);
        this.loadComments(this.state.post_id);
    }

    render() {
        let postbody = this.getPostBody();
        let commentsbody = this.getCommentsBody();

        return (
            <div>
                {postbody}
                {commentsbody}
            </div>
        );
    }
}