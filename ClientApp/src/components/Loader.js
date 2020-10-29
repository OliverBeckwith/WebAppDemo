import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router'

export async function Loader(props) {

    const history = useHistory();

    if (props.toAwait) {
        await props.toAwait();
    }
    if (props.refresh) {
        history.go();
    }

    return <Redirect to={this.state.onLoadGoTo} />
}
