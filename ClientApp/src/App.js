import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Posts } from './components/Posts';
import { NewPost } from './components/NewPost';
import { AdminHome } from './components/admin/AdminHome';
import { Login } from './components/admin/Login';
import { Loader } from './components/Loader';

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
    console.log("Admin: " + isAdmin);
    this.setState({ loading: false, admin: isAdmin });
  }

  render() {
    if (this.state.loading === true) {
      return (
        null
      );
    }

    return (
      <Switch>
        <Route path="/admin" render={({ match: { url } }) => {
          if (!this.state.admin) {
            return <Redirect to="/login" />
          }
          else {
            return (
              <Layout subtitle="Admin">
                <Route exact path={`${url}/`} component={AdminHome} />
                <Route path={`${url}/edit/:id`} component={EditPost} />
                <Route path={`${url}/logout`} render={() => {
                  return <Loader toAwait={() => { fetch('/api/admin/logout', { method: "POST", credentials: "include" }) }} onLoadGoTo="/" />
                }} />
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
