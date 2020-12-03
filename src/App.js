import React from "react";
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/NavBar.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home.js";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />  
          <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/dfa-mini">
            <div>
              <h1>
                Under Construction!
              </h1>
            </div>
          </Route>
          <Route exact path="/nfa-mini">
            <div>
                <h1>
                  Under Construction!
                </h1>
              </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
