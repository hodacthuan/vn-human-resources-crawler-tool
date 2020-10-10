import Login from "./pages/Login";
import Private from "./pages/Private";
import React from 'react';
import { Route, Redirect, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
// import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <>

      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/app" component={Private} />
          <Route path="*" component={null} >
            <Redirect to='/login' />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;