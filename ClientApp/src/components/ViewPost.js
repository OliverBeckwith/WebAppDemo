import React, { Component } from 'react';
import { useParams } from "react-router-dom";

export function ViewPost()
{
    let { id } = useParams();

    if(id)
    {
        return <Post id={id}/>
    }
}

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = { post: null, loading: true };

        this.loadPost(props.id);
    }

    async loadPost(id) {
        const response = await fetch("api/posts/" + id);
        const post = await response.json();
        this.setState({ loading: false, post: post });
    }

    render() {
        let body;
        if (this.state.loading) {
            body = (
                <div>
                    <h2>Post Loading</h2>
                </div>
            );
        }
        else {
            body = (
                <div>
                    <h2>{this.state.post.title}</h2>
                    <em>Posted at: {this.state.post.posted}</em>
                    <p>{this.state.post.content}</p>
                </div>
            );
        }
        return body;
    }
}