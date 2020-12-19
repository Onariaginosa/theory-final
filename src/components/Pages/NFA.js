import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


function NFA() {
  // Warning Modal Variables
  const [warning, setWarning] = useState("");
  const [show, setShow] = useState(false);

  // State Input Box Variables
    const [transition, setTransition] = useState("0");
    const [source, setSource] = useState("");
    const [target, setTarget] = useState("");

  // String Input Box Variables
    const [testerString, setTesterString] = useState("");
    const [acceptedString, setAcceptedString] = useState(null);

  // Graph Variables
  const [startState, setStartState] = useState({ state: "" });
  const [nodes, setNodes] = useState({});// {node: {0: [], 1: [], 'λ': [] }, node2: ...}
  const [acceptStates, setAcceptStates] = useState([]);

  const handleClose = () => {
    setShow(false);
    setWarning("");
  };

  const handleShow = () => setShow(true);

  const handleStartState = (id) => {
    let newState = { state: id };
    setStartState({ ...newState });
  };

  const handleAcceptState = (id) => {
    let newAccepts = [...acceptStates];
    if (!newAccepts.includes(id)) {
        newAccepts.push(id)
    } else {
      let idIndex = newAccepts.indexOf(id);
      newAccepts.splice(idIndex, 1);
    }
    setAcceptStates([...newAccepts])
  };

  const removeAccepts = (garbage) => {
    let newAccepts = [ ...acceptStates ]
    if (newAccepts.includes(garbage)) {
      let garbageIndex = newAccepts.indexOf(garbage);
      newAccepts.splice(garbageIndex, 1);
      setAcceptStates([...newAccepts])
    }
  }

  const handleRemoveState = (state) => {
    let index;
    if (startState.state !== state) {
      let newNodes = { ...nodes };
      removeAccepts(state)
      for (let node in nodes) {
        if (node === state) {
          delete newNodes[node];
        } else {
          for (let trans in nodes[node]) {
            if (newNodes[node][trans].includes(state)) {
              index = newNodes[node][trans].indexOf(state);
              newNodes[node][trans].splice(index, 1);
            }
          }
        }
      }
      setNodes({ ...newNodes })
    } else {
      setWarning("You cannot delete the start state. Select a new state to be your start state before deleting.")
      setShow(true)
    }
  }

  const partialAccept = (str, current, lambdaLoops) => {
    if (!Array.isArray(lambdaLoops)) {
      lambdaLoops = [];
    }
    if (str === "") {
      return acceptStates.includes(current);
    } else {
      let node = nodes[current];
      for (let transition in node) {
        if (transition === str.substring(0, 1)) {
          for (let state of nodes[current][transition]) {
            if (partialAccept(str.substring(1), state)) {
              return true;
            }
          }
        }
        if (transition === "λ" && !lambdaLoops.includes(current) && nodes[current][transition].length > 0) {
          lambdaLoops.push(current);
          for (let state of nodes[current][transition]) { 
            if (partialAccept(str, state, lambdaLoops)) {
              return true;
            }
          }
        }
      }
      return false;
    }
  }

  const isStringAccepted = () => {
    let str = testerString.replace(/\s+/g, '')
    str = str.replace(/λ/g, "");
    setAcceptedString(partialAccept(partialAccept(str, startState.state)));
    setAcceptedString(partialAccept(str, startState.state));
  }

  const handleValidate = () => {
    if (Object.keys(nodes).length === 0) {
      setAcceptedString(null);
      setWarning("Please enter a NFA")
      setShow(true)
    } else if (startState.state === "") {
      setAcceptedString(null);
      setWarning("Please select a start state.")
      setShow(true)
    }else if (/^([01λ\s]*)$/.test(testerString)) {
      isStringAccepted();
    } else {
      setAcceptedString(null);
      setWarning("Σ = { '0', '1', 'λ' }. Please only use characters in the given alphabet. String: "+testerString)
      setShow(true)
    }
  }
  const handleAdd = () => {
    let newNodes = { ...nodes };
    let foundSrc = false;
    let foundTarget = false;
    setSource(source.replace(/\s+/g, ''));
    setTransition(transition.replace(/\s+/g, ''));
    if (transition === "" || source === "" || target === "") {
      setWarning("Invalid entry try again");
      handleShow();
    } else if (target === source  && transition === "λ") {
      setWarning("Cannot lambda move state to itself");
      handleShow();
    } else {
      for (let node in newNodes) {
        if (startState.state === "") {
          let start = {}
          start.state = source
          setStartState({ ...start })
        }
        if (node === source) {
          foundSrc = true;
          if (!newNodes[node][transition]) {
            newNodes[node][transition] = [];
            newNodes[node][transition].push(target);
          }
          else if (!newNodes[node][transition].includes(target)) {
            newNodes[node][transition].push(target);
          }
        }
        if (node === target) {
          foundTarget = true
        }
      }
      if (!foundSrc) {
        newNodes[source] = {};
        newNodes[source][transition] = [];
        newNodes[source][transition].push(target);

      }
      if (!foundTarget) {
        newNodes[target] = { };
      }
    }
    setNodes({ ...newNodes })
  }

  return (
    <div>
      <div>
        <h1 style={{
          margin: "50px",
          justifyContent: "center",
          }}
        >
          NFA Simulator
        </h1>
        <Row style={{
        margin: "5px",
        justifyContent: "center",
        }}
        >
          <h3> {acceptedString === null ? "Enter a string to validate" :
            acceptedString === false ? "Your Entered String is not Accepted" :
            "Your Entered String is Accepted"}
          </h3>
        </Row>
      </div>
      <div style={{
            margin: "25px",
            justifyContent: "center",
      }}>
        <Row style={{
        justifyContent: "center",
        }}
        >
          
        <div style={{
                outline: "3px dotted #1a7081",
                width: "90%",
                margin: "50px",
                padding: "50px 50px 50px 50px"
              }}>
              <Form>
                <Form.Row>
                  <Form.Group as={Col} controlId="SourceNode">
                    <Form.Label> Source Node: </Form.Label>
                    <Form.Control
                        placeholder="Enter source node name"
                        onChange={(e) => setSource(e.target.value)}
                        defaultValue={source} />
                  </Form.Group>
                  <Form.Group as={Col} xs={2} controlId="Transitions">
                    <Form.Label>Transition: </Form.Label>
                    <Form.Control
                        as="select"
                        onChange={(e) => setTransition(e.target.value)}
                        defaultValue={transition}
                    >
                      <option>{"λ"}</option>
                      <option>{"0"}</option>
                      <option>{"1"}</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group as={Col} controlId="TargetNode">
                    <Form.Label> Target Node: </Form.Label>
                    <Form.Control
                        placeholder="Enter target node name"
                        onChange={(e) => setTarget(e.target.value)}
                        defaultValue={target} />
                  </Form.Group>
                </Form.Row>
                <Form.Row style={{
                    justifyContent: "right",
                    margin: " 5px 5px 15px 5px",
                }}>
                  <Button variant="info" onClick={() => handleAdd()}>Add</Button>{' '}
                </Form.Row>
              </Form>
            </div>
        </Row>
        <Row style={{
          justifyContent: "center",
          }}
        >
          <Col xs={8}>
            <Row style={{
              justifyContent: "center",
              }}
            >
              <h2> Graph</h2>
            </Row>
            <Row>
            <div style={{
                    outline: "3px dotted #1a7081",
                    width: "90%",
                    margin: "50px",
                    padding: "50px 50px 50px 50px",

                    }}
                >
                    <Row>
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>Source Node</th>
                                    <th>λ</th>
                                    <th>0</th>
                                    <th>1</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(nodes).map(([src, trans]) => (
                                    <tr>
                                        <td>{src}</td>
                                        <td>{trans["λ"] && trans["λ"].length > 0 ? trans["λ"].join(", ") : " "}</td>
                                        <td>{trans["0"] && trans["0"].length > 0 ? trans["0"].join(", ") : " "}</td>
                                        <td>{trans["1"] && trans["1"].length > 0 ? trans["1"].join(", ") : " " }</td>
                                        <td>
                                            <Button variant="info" id={`S${src}`} onClick={() => handleStartState(src)}>
                                                Start State
                                            </Button>{' '}
                                            <Button variant="info" id={`A${src}`} onClick={() => handleAcceptState(src)}>
                                                Accept State
                                            </Button>{' '}
                                            <Button variant="danger" id={`R${src}`} onClick={() => handleRemoveState(src)}>
                                                Remove State
                                            </Button>{' '}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Row>
                    <Row>
                        <h4>Start State: {startState.state}</h4>

                    </Row>
                    <Row>
                        <h4>Accept States: {acceptStates.join(", ")}</h4>
                    </Row>
                </div>
            </Row>
            <Row>
            </Row>
          </Col>
          <Col xs={3}>
            <Row style={{
              justifyContent: "center",
              }}
            >
              <h2> String Validation</h2>
            </Row>
            <Row>
              <div style={{
                outline: "3px dotted #1a7081",
                width: "90%",
                margin: "50px",
                padding: "50px 50px 50px 50px",
                justifyContent: "center",
                display: "flex",

                }}
              >
                <Row >
                <Form>
                  <Form.Row>
                    <Form.Group controlId="InputString">
                      <Form.Label> Test String: </Form.Label> 
                      <Form.Control 
                        placeholder="Enter string to test"
                        onChange={(e) => setTesterString(e.target.value)}
                        defaultValue={testerString} />
                    </Form.Group>
                  </Form.Row>
                    <Button variant="info" onClick={() => handleValidate()}> {acceptedString === null ? "Validate" : "Update Validation"} </Button>{' '}
                </Form>
                </Row>
              </div>
            </Row>
          </Col>
        </Row>
      </div>
      <div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Warning!</Modal.Title>
          </Modal.Header>
          <Modal.Body>{warning}</Modal.Body>
        </Modal>
      </div>
    </div>
  )
}

export default NFA