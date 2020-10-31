import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

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
                        <Row>
                            <Col sm="2">
                                <label>Title:</label>
                            </Col>
                            <Col sm="6">
                                <input type="text" name="title" value={this.state.title} onChange={this.handleChange} />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="2">
                                <label>Content:</label>
                            </Col>
                            <Col sm="6">
                                <input type="text" name="content" value={this.state.content} onChange={this.handleChange} />
                            </Col>
                        </Row>
                        <Row><Col sm="auto">
                            <input type="submit" value="Post" />
                        </Col></Row>
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