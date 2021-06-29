import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './app/components/Home';
import Profile from './app/components/Profile';
import UserPage from './app/components/UserPage';
import Hairstylist from './app/components/Hairstylist';
import SignUp from './app/components/SignUp';
import Login from './app/components/Login';
import Calendar from './app/components/Calendar';


import "primereact/resources/themes/saga-blue/theme.css"
import "primereact/resources/primereact.min.css"

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/home' exact={true} component={Home}/>
          <Route path='/profile' exact={true} component={Profile}/>
          <Route path='/user' exact={true} component={UserPage}/>
          <Route path='/pm' exact={true} component={Hairstylist}/>
          <Route path='/signin' exact={true} component={Login}/>
          <Route path='/signup' exact={true} component={SignUp}/>  
          <Route path='/calendar' exact={true} component={Calendar}/>  
        </Switch>
      </Router>
    )
  }
}

export default App;