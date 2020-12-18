import React from "react";
import './App.css';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from "./components/NavBar.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Pages/Home.js";
import NFAmin from "./components/Pages/NFAmin.js";
import DFAmin from "./components/Pages/DFAmin.js";
import NFA from "./components/Pages/NFA.js";
import DFA from "./components/Pages/DFA.js";

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
            {/* <div>
            <h1>
              Under Construction!
            </h1>
            </div> */}
          </Route>
          <Route exact path="/nfa-mini">
            <NFAmin />
          </Route>
          <Route exact path="/nfa">
            <NFA />
          </Route>
          <Route exact path="/dfa">
            <DFA />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
