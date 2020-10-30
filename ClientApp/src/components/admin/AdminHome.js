import React, { Component } from 'react';

export class AdminHome extends Component {
  static displayName = AdminHome.name;

  render () {
    return (
      <div>
        <h2>Administration</h2>
        <p>Within this area you can now:</p>
        <ul>
          <li><a href='/admin/post/new'>Create a New Post</a> and <code>Edit</code> posts from the Posts page</li>
          <li><a href='/admin/createadmin'>Create more Admins</a></li>
        </ul>
      </div>
    );
  }
}
