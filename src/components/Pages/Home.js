import React from "react";
import Graph from "../Graph";
import "../../App.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputForm from '../Form';
import Chart from '../Chart';


function Home() {

  return (
    <div>
      <div>
        <h1>
              Hello! Hello! This is Ona's Theory Final Project
        </h1>
        <h2> What I chose to do</h2>
        <p> I decided to create a NFA simulator, and a DFA minimizer</p>
        <p> Grade easily please! 😊</p>
      </div>
      {/* <div style={{
        margin: "25px",
        // display: "flex",
        justifyContent: "center",
      }}>
        <Row>
          <Col xs={8}>
            <Row>
              <InputForm />
            </Row>
            <Row>
              <Graph />
            </Row>
          </Col>
          <Col>
            <Row>
              <Chart />
            </Row>
          </Col>
        </Row>
      </div> */}
    </div>
  )
}
  
export default Home;