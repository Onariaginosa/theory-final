import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import Graph from "../Graph";


function DFAmin() {
  // Warning Modal Variables
  const [warning, setWarning] = useState("");
  const [show, setShow] = useState(false);

  // Input Box Variables
  const [transition, setTransition] = useState("0");
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");

  // Original Graph Variables
  const [startState, setStartState] = useState({ state: "" });
  const [nodes, setNodes] = useState({});
  const [acceptStates, setAcceptStates] = useState([]);
  const [complete, setComplete] = useState(false); // if the dfa is complete (all states have all transitions filled)

  // Minimized Graph Variables
  const [minNodes, setMinNodes] = useState({});
  const [minAcceptStates, setMinAcceptStates] = useState([]);
  const [minStartState, setMinStartState] = useState({ state: "" });

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
    if (startState.state !== state) {
      let newNodes = { ...nodes };
      removeAccepts(state)
      for (let node in nodes) {
        if (node === state) {
          delete newNodes[node];
        } else {
          for (let trans in nodes[node]) {
            if (nodes[node][trans] === state) {
              delete newNodes[node][trans];
            }
          }
        }
      }
      setNodes({ ...newNodes })
      if (isCompleteDFA(newNodes)) {
        setComplete(true)
      } else {
        setComplete(false)
      }
    }
  }

  const isCompleteDFA = (graphNodes) => {
    for (let node in graphNodes) {
      if (graphNodes[node]["0"] === undefined ||
          graphNodes[node]["0"] === "" ||
          graphNodes[node]["1"] === undefined ||
          graphNodes[node]["1"] === "") {
        return false
      }
    }
    return true;
  }

  const handleMinimize = () => {
    if (Object.keys(nodes).length === 0) {
      setWarning("Please enter a DFA")
      setShow(true)
    } else if (complete) {
      minimizeGraph(nodes)
    } else {
      setWarning("Cannot minimize a DFA if there are states with empty transitions")
      setShow(true)
    }
  }

  const sameGroup = (x, y) => {
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false;
    } 
    for (let key in x) {
      if (y[key] === undefined) {
        return false;
      } else if (x[key].length !== y[key].length) {
        return false;
      }
    }
    return true;;
  }

  const getCurrentBehavior = (node, groups) => {
    let transitions = [];
    let behavior = {}
    for (let state in nodes) {
      if (state === node) {
        transitions[0] = nodes[state]["0"];
        transitions[1] = nodes[state]["1"];
      }
    }
    for (let group in groups) {
      if (groups[group].includes(transitions[0])) {
        behavior["0"] = group;
      }
      if (groups[group].includes(transitions[1])) {
        behavior["1"] = group;
      }
      if (behavior["0"] !== undefined && behavior["1"] !== undefined) { break; }
    }
    return behavior;
  }

  const matchBehaviors = (currentBehavior, groupBehaviors, currentAccept) => {
    let behaviorA;
    for (let behavior in groupBehaviors) {
      behaviorA = "A" + behavior
      if (groupBehaviors[behavior]["0"] === currentBehavior["0"] &&
        groupBehaviors[behavior]["1"] === currentBehavior["1"] &&
        groupBehaviors[behaviorA] === currentAccept) {
        return behavior;
      }
    }
    return -1;
  }

  const minimizeGraph = (graphNodes) => {
    let oldgroups = {};
    let newgroups = {};
    let groupBehaviors = {};
    let currentBehavior = {};
    let temp;
    let groupCount = 2;
    let accept

    // split between accept states and non accept states
    newgroups[0] = [...acceptStates];
    newgroups[1] = [];
    for (let node in graphNodes) {
      if (!acceptStates.includes(node)) {
        newgroups[1].push(node);
      }
    }
    // loopin time (until old graph and new graph are the same)
    while (!sameGroup(oldgroups, newgroups)) {
      oldgroups = { ...newgroups };
      newgroups = {};
      groupBehaviors = {}
      // set group Behaviors
      for (let group in oldgroups) {
        for (let node of oldgroups[group]) {
          accept = "A" + group;
          groupBehaviors[group] = getCurrentBehavior(node, oldgroups);
          groupBehaviors[accept] = acceptStates.includes(node);
          break;
        }
      }
      // loop to see if current behavior matches group behavior
      for (let group in oldgroups) {
        for (let node of oldgroups[group]) {
          currentBehavior = getCurrentBehavior(node, oldgroups);
          temp = matchBehaviors(currentBehavior, groupBehaviors, acceptStates.includes(node));
          if (temp === -1) {
            newgroups[groupCount] = [node];
            groupBehaviors[groupCount] = currentBehavior;
            groupCount++;
          } else if (newgroups[temp] !== undefined) {
            newgroups[temp].push(node);
          } else {
            newgroups[temp] = [node]
          }
        }
      }
    }
    // we have our groups now we make the minimized nodes and transitions
    let newNodes = {}
    let newName, newTarget, trans;
    let minAccepts = []
    for (let behavior in groupBehaviors) {
      if (behavior.charAt(0) !== "A") {
        newName = newgroups[behavior].join("");
        newNodes[newName] = {}
        if (newgroups[behavior].includes(startState.state)) {
          setMinStartState({ state: newName })
        }
        if (acceptStates.includes(newgroups[behavior][0])) {
          minAccepts.push(newName);
        }
        for (let i = 0; i <= 1; i++) {
          trans = "" + i;
          newTarget = newgroups[groupBehaviors[behavior][trans]];
          newNodes[newName][trans] = newTarget.join("");
        }
      }
    }
    setMinNodes({ ...newNodes })
    setMinAcceptStates([...minAccepts])
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
    } else {
      for (let node in newNodes) {
        if (startState.state === "") {
          let start = {}
          start.state = source
          setStartState({ ...start })
        }
        if (node === source) {
          foundSrc = true;
          newNodes[node][transition] = target;
        }
        if (node === target) {
          foundTarget = true
        }
      }
      if (!foundSrc) {
        newNodes[source] = {};
        newNodes[source][transition] = target;

      }
      if (!foundTarget) {
        newNodes[target] = { };
      }
    }
    if (isCompleteDFA(newNodes)) {
      setComplete(true);
    } else {
      setComplete(false);
    }
    setNodes({ ...newNodes })
  }

  return (
    <div>
      <div>
        <h1 style={{
          margin: "50px",
          // justifyContent: "center",
          }}
        >
          DFA Minimizer
        </h1>
        <Row style={{
        margin: "5px",
        justifyContent: "center",
        }}
        >
          <h3> Graph {complete ? "is" : "is not"} currently minimized </h3>
        </Row>
        <Row style={{
          // margin: "50px",
          justifyContent: "center",
          }}
        >
          <Button variant="info" onClick={() => handleMinimize()}> Update Minimization </Button>{' '}
        </Row>
      </div>
      <div style={{
            margin: "25px",
            // display: "flex",
            justifyContent: "center",
      }}>
        <Row>
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
        <Row>
          <Col xs={5}>
            <Row>
              <h2>Original Graph</h2>
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
                                    <th>0</th>
                                    <th>1</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(nodes).map(([src, trans]) => (
                                    <tr>
                                        <td>{src}</td>
                                        <td>{trans["0"]? trans["0"] : " "}</td>
                                        <td>{trans["1"]? trans["1"] : " " }</td>
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
          <Col xs={5}>
            <Row>
              <h2>Minimized Graph</h2>
            </Row>
            <Row>
              <div style={{
                outline: "3px dotted #1a7081",
                width: "90%",
                margin: "50px",
                padding: "50px 50px 50px 50px",
                
                }}
              >
                <Row >
                  <Table striped>
                    <thead>
                        <tr>
                            <th>Source Node</th>
                            <th>0</th>
                            <th>1</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(minNodes).map(([src, trans]) => (
                            <tr>
                                <td>{src}</td>
                                <td>{trans[0]? trans[0] : " "}</td>
                                <td>{trans[1]? trans[1] : " " }</td>
                            </tr>
                        ))}
                    </tbody>
                  </Table>
                </Row>
                <Row>
                    <h4>Start State: {minStartState.state}</h4>
                    
                </Row> 
                <Row>
                    <h4>Accept States: {minAcceptStates.join(", ")}</h4>
                </Row>        
              </div>
            </Row>
            <Row>
              {/* <Graph /> */}
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
  
export default DFAmin;