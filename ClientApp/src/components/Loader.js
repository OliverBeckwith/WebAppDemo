import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export class Loader extends Component {
    static displayName = Loader.name;

    constructor(props) {
        super(props);

        this.state = {loading:true,onLoadGoTo:props.onLoadGoTo}

        if (props.toAwait !== undefined) {
            this.load(props.toAwait);
        }
    }

    async load(toAwait) {
        console.log("Loading")
        await toAwait();
        this.setState({loading:false});
        console.log("Loaded")
    }

    render() {
        if (this.state.loading) {
            return null;
        }

        return <Redirect to={this.state.onLoadGoTo} />
    }
}
