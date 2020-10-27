import React, { Component } from 'react';

export class AdminHome extends Component {
  static displayName = AdminHome.name;

  render () {
    return (
      <div>
        <h2>Admin Area</h2>
        <p>This area requires Authentication to access</p>
      </div>
    );
  }
}
