import React, { Component } from 'react';
import { useParams } from "react-router-dom";
import { checkAdmin, loadPost, truncate } from "../core";
import { Col, Row } from 'reactstrap';

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
            return (
                <div>
                    <Row>
                        <Col xs="auto">
                            <h2 className="post-title">{this.state.post.title}</h2>
                        </Col>
                        {this.state.admin
                            ? (<Col xs="auto">
                                <a href={`/admin/post/edit/${this.props.id}`}>
                                    <i class="fas fa-edit"></i>
                                </a>
                            </Col>)
                            : null
                        }
                    </Row>
                    <Row className="post-date">
                        <Col sm="auto"><em>
                            Posted at: {new Date(this.state.post.posted).toLocaleString()}
                        </em></Col>
                        <Col sm="auto"><em>
                            {this.state.post.modified != this.state.post.posted
                                ? `Last modified at: ${new Date(this.state.post.modified).toLocaleString()}`
                                : null}
                        </em></Col>

                    </Row>
                    <p className="post-content">{this.state.post.content}</p>

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
                                <Row>
                                    <Col sm="2" className="comment-author">
                                        <strong>{comment.author}</strong>
                                    </Col>
                                    <Col sm="7" className="comment-content">
                                        {comment.content}
                                    </Col>
                                    <Col xs="6" sm="2" className="comment-date">
                                        <em>{new Date(comment.commented).toLocaleString().replace(",", "")}</em>
                                    </Col>
                                    {this.state.admin
                                        ? (<Col xs="6" sm="1" style={{ textAlign: "end", alignSelf: "center" }}>
                                            <a href='#' onClick={(e) => { e.preventDefault(); this.deleteComment(comment.id) }}>
                                                <i class="fas fa-trash-alt"></i>
                                            </a>
                                        </Col>)
                                        : null
                                    }
                                </Row>
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
                    <hr />
                    <h4>Leave a Comment</h4>
                    <form method="post" onSubmit={this.handleCommentSubmit}>
                        <Row>
                            <Col sm="2">
                                <label>Display Name:</label>
                            </Col>
                            <Col sm="6">
                                <input name="author" value={truncate(this.state.newcomment.author, 25)} onChange={this.handleCommentChange} />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="2" >
                                <label>Comment:</label></Col>
                            <Col sm="6">
                                <textarea name="content" value={truncate(this.state.newcomment.content, 400)} onChange={this.handleCommentChange} />
                            </Col>
                        </Row>
                        <Row><Col sm="auto">
                            <input type="submit" value="Submit" />
                        </Col></Row>
                    </form>
                </div>

            )
        }
    }

    handleCommentChange(e) {
        let newcomment = this.state.newcomment;
        newcomment[e.target.name] = e.target.name == "author" && e.target.value.length > 20
            ? e.target.value.substring(0, 20)
            : e.target.value;
        this.setState({ newcomment: newcomment });
    }

    async handleCommentSubmit(e) {
        e.preventDefault();
        const response = await fetch(`/api/posts/${this.state.post_id}/newcomment`, {
            method: "post",
            body: JSON.stringify(this.state.newcomment),
            headers: { 'Content-Type': 'application/json' },
        });
        this.setState({ newcomment: { content: '', author: '' } });
        this.loadComments(this.state.post_id);
    }

    async deleteComment(id) {
        const response = await fetch(`/api/admin/comment`, {
            method: "delete",
            body: JSON.stringify(id),
            headers: { 'Content-Type': 'application/json' },
        });
        this.loadComments(this.state.post_id);
    }

    render() {
        let postbody = this.getPostBody();
        let commentsbody = this.getCommentsBody();

        return (
            <div>
                {postbody}
                <hr />
                {commentsbody}
            </div>
        );
    }
}