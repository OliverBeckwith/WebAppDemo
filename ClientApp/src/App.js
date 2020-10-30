import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Posts } from './components/Posts';
import { ViewPost } from './components/ViewPost';
import { NewPost } from './components/admin/NewPost';
import { AdminHome } from './components/admin/AdminHome';
import { Login } from './components/admin/Login';
import { Loader } from './components/Loader';
import { EditPost } from './components/admin/EditPost';
import { CreateAdmin } from './components/admin/CreateAdmin';
import { checkAdmin } from "./core";
import './custom.css'

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
              <Layout subtitle="Admin" admin={this.state.admin}>
                <Route exact path={`${url}/`} component={AdminHome} />
                <Route path={`${url}/createadmin`} component={CreateAdmin} />
                <Route path={`${url}/post/new`} component={NewPost} />
                <Route path={`${url}/post/edit/:id`} component={EditPost} />
                <Route path={`${url}/logout`} render={() => {
                  return <Loader
                    toAwait={() => { fetch('/api/admin/logout', { method: "POST", credentials: "include" }) }}
                    onLoadGoTo="/" refresh={true}
                  />
                }} />
              </Layout>
            );
          }
        }} />

        <Route path="/">
          <Layout subtitle="Public" admin={this.state.admin}>
            <Route exact path="/" component={Home} />
            <Route path='/posts' component={Posts} />
            <Route path='/post/:id' component={ViewPost} />
            <Route path="/login" render={() => {
              if(this.state.admin)
              {
                return <Redirect to="/admin" />
              }
              else{
                return <Login />
              }
            }}/>
          </Layout>
        </Route>
      </Switch>
    );
  }
}
