import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
        <h1>Oliver Beckwith - WebAppDemo</h1>
        <p>A demonstration app showcasing ability with:</p>
        <ul>
          <li><strong>Asp.Net MVC</strong></li>
          <li><strong>Data Access</strong> using <code>Dapper</code> with <code>Sqlite3</code></li>
          <li><strong>Authentication</strong> using id and a hashed password (with salt) login</li>
          <li><strong>React</strong></li>
        </ul>
      </div>
    );
  }
}
