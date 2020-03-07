import React, {Component} from 'react';
import {BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

import GamePage from './components/gamepage/GamePage';
import LoginPage from './components/loginpage/LoginPage';
import ErrorPage from './components/errorpage/ErrorPage';
import './App.css';

class App extends Component {
    render() {
      return(
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={LoginPage} />
            <Route exact path='/game/:slug'  component={GamePage} />
            <Route exact path="*" component={ErrorPage} />
          </Switch>
        </BrowserRouter>
      );
    }
}

export default App;
