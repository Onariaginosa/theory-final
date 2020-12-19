import React from "react";
import './App.css';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/NavBar.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Pages/Home.js";
import DFAmin from "./components/Pages/DFAmin.js";
import NFA from "./components/Pages/NFA.js";
import TestNFA from "./test/TestNFA.js";
import TestDFAmin from "./test/TestDFAmin.js";

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
          <Route exact path="/nfa">
            <NFA />
          </Route>
          <Route exact path="/nfa-tests">
            <TestNFA />
          </Route>
          <Route exact path="/dfa-mini-tests">
            <TestDFAmin />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
