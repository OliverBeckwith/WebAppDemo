import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { loadPost } from '../../core';
import { Row, Col } from 'reactstrap';

export function EditPost(props) {

    let { id } = useParams();
    if (id) {
        return <EditPostForm id={id} />
    }
}

class EditPostForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saved: false,
            deleted: false,
            post: {
                title: '',
                content: ''
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.getPost(props.id)
    }

    async getPost(id) {
        const post = await loadPost(id);
        this.setState({ post: post });
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
                        <Row>
                            <Col sm="2">
                                <label>Title:</label>
                            </Col>
                            <Col sm="6">
                                <input type="text" name="title" value={this.state.post.title} onChange={this.handleChange} />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="2">
                                <label>Content:</label>
                            </Col>
                            <Col sm="6">
                                <input type="text" name="content" value={this.state.post.content} onChange={this.handleChange} />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="auto">
                                <input type="submit" value="Post" />
                            </Col>
                            <Col sm="auto">
                                <a href='#' onClick={(e) => { e.preventDefault(); this.handleDelete() }}>
                                    <i class="fas fa-trash-alt"></i>
                                </a>
                            </Col>
                        </Row>
                    </form>
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