import React from "react";
import './App.css';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/NavBar.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Pages/Home.js";
import NFAmin from "./components/Pages/DFAmin.js";
import DFAmin from "./components/Pages/NFAmin.js";

function App() {
  return (
    <div className="App">
      <Router basename="/theory-final#">
        <NavBar />  
          <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/dfa-mini">
            <DFAmin />
          </Route>
          <Route exact path="/nfa-mini">
            <NFAmin />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
