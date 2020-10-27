import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Posts } from './components/Posts';
import { NewPost } from './components/NewPost';
import { AdminHome } from './components/admin/AdminHome';
import { Login } from './components/admin/Login';

import './custom.css'
import { EditPost } from './components/admin/EditPost';
import { CreateAdmin } from './components/admin/CreateAdmin';
import { checkAdmin } from "./core";

export default class App extends Component {
  static displayName = App.name;

  constructor(props) {
    super(props);
    this.state = { loading: true, admin: false }

    this.getAdmin();
  }

  async getAdmin() {
    const isAdmin = await checkAdmin();
    this.setState({ loading: false, admin: isAdmin });
  }

  render() {

    if (this.state.loading === true) {
      return (
        <Layout>
          <h2>Loading</h2>
        </Layout>
      );
    }

    return (
      <Switch>
        <Route path="/admin" render={() => {
          if (!this.state.admin) {
            return <Redirect to="/login" />
          }
          else {
            return (
              <Layout subtitle="Admin">
                <Route exact path="/" component={AdminHome} />
                <Route path='/edit' component={EditPost} />
              </Layout>
            );
          }
        }} />

        <Route path="/">
          <Layout subtitle="Public">
            <Route exact path="/" component={Home} />
            <Route path='/list' component={Posts} />
            <Route path='/new' component={NewPost} />
            <Route path="/login" component={Login} />
            <Route path="/create" component={CreateAdmin} />
          </Layout>
        </Route>
      </Switch>
    );
  }
}
