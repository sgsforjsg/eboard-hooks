import React, { Component } from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar1 from './components/layout/Navbar'

import Dashboard from './components/dashboard/Dashboard'
import DashboardView from './components/projects/viewNoticeDatas'
import ProjectDetails from './components/projects/ProjectDetails'

import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'


import CreateMedia from './components/projects/mediaForm';
import CreateNotice from './components/projects/Hookform';
//import EditNotice from './components/projects/EditNotice';
import EditNotice from './components/projects/Hookform'
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
      
          <Navbar1 />
         
          <Switch>
            <Route exact path='/'component={Dashboard} />
            <Route path='/view' component={DashboardView} />
            <Route path='/project/:id' component={ProjectDetails} />
            <Route path='/edit/:id' component={EditNotice} />
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/create/:id' component={CreateNotice} />
            <Route path='/media/:id' component={CreateMedia}/>
            
          </Switch>
         { /*<Navbar1 />*/}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
