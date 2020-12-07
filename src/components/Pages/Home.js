import React from "react";
import Graph from "../Graph";
import "../../App.css";
import Row from 'react-bootstrap/Row';
import InputForm from '../Form';


function Home() {

  return (
    <div>
      <div>
        <h1>
              Hello! Hello! This is Ona's Theory Final Project
        </h1>
        <h2> What I chose to do</h2>
        <p> I decided to create a DFA minimizer, and a NFA minimizer</p>
        <p> Grade easily please! 😊</p>
      </div>
      <div style={{
        margin: "25px",
        // display: "flex",
        justifyContent: "center",
      }}>
        <Row>
          <h2> Graph Below:</h2>
        </Row>
        <Row>
          <InputForm />
        </Row>
        <Row>
          <Graph />
        </Row>
      </div>
    </div>
  )
}
  
export default Home;