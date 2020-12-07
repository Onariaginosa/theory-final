import React, { useState } from "react";
import Graph from "../Graph";
import "../../App.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Chart from '../Chart';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal"

function NFA() {
    // graph is in the format 
    // { source id / name: [λ transition targets[], 0 transition target, 1 transition target], }
    // let graph = {};
    // are in the form [ {name: boolean if accept}]
    // let nodes = [];
    // edges are in the form [{source:[target, transition]}]
    // let edges = [];

    const transitionIndex = { "λ": 0, "0": 1, "1": 2 };

    const [graph, setGraph] = useState({});

    const [nodes, setNodes] = useState([]);

    const [edges, setEdges] = useState([]);

    const [transition, setTransition] = useState("0");
    const [source, setSource] = useState("");
    const [target, setTarget] = useState("");
    const [warning, setWarning] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setWarning("");
    };

    const sameArray = (a1, a2) => {
        if (a1.length !== a2.length) {
            return false
        } 
        for (let i = 0; i < a2.length; i++) {
            if (a1[i] !== a2[i]) {
                return false
            }
        }
        return true;
    }

    const sameObject = (o1, o2) => {
        if (o1.size === o2.size) {
            for (let key in o1) {
                if (o1[key] !== o2[key]) {
                    return false;
                }
            }
        } else {
            return false
        }
        return true
    }


    const objectInList = (list, object) => {
        let broke = false;
        for (const inside of list) {
            if (inside.size === object.size) {
                for (let key in object) {
                    if (Array.isArray(object[key]) && !sameArray(inside[key], object[key])){
                        broke = true;
                        break;
                    } else if (typeof object[key] === "object" && !sameObject(object[key], inside[key])) {
                        broke = true;
                        break;
                    } else if (object[key] !== inside[key]) {
                        broke = true;
                        break;
                    }
                }
                if (broke) {
                    return true;
                }
                
            }
        }
        return false;
    }
    
    const handleShow = () => setShow(true);
    
    const handleAdd = () => {
        let newNodes = nodes;
        let newEdges = edges;
        let newGraph = graph;
        setSource(source.replace(/\s+/g, ''));
        setTransition(transition.replace(/\s+/g, ''));
        if (transition === "" || source === "" || target === "") {
            setWarning("Invalid entry try again");
            handleShow();
        } else {
            let edge = { source: [target, transition] }
            if (!objectInList(nodes, { source: false })) {
                newNodes.push({ source: false });
                newNodes.push({ target: false });
                newEdges.push(edge);
                let temp = [[], [], []];
                temp[transitionIndex[transition]].push(target);
                newGraph[source] = temp

                setNodes(newNodes);
                setEdges(newEdges);
                setGraph(newGraph);

                console.log("returned in no source")
                console.log(graph);
                return;
            } else if (!nodes.includes(target)) {
                newNodes.push({ target: false });
                newEdges.push(edge);
                setNodes(newNodes);
                setEdges(newEdges);
                
            } else if (!objectInList(edges, edge)) {
                newEdges.push(edge);
                setEdges(newEdges);
            }
            if (newGraph[source]) {
                let addition = newGraph[source][transitionIndex[transition]];
                if (!addition.includes(target)) {
                    addition.push(target)
                    newGraph[source][transitionIndex[transition]] = addition;
                    setGraph(newGraph);
                }
            } else {
                let temp = [[], [], []];
                temp[transitionIndex[transition]].push(target);
                newGraph[source] = temp
                setGraph(newGraph);

            }
        }
        console.log("returned in given source")
        console.log(graph);
    }

    return (
        <div>
        <div>
            <h1>
                NFA Visualizer
            </h1>
        </div>
        <div style={{
            margin: "25px",
            // display: "flex",
            justifyContent: "center",
        }}>
            <Row>
            <Col xs={8}>
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
                                <option>{"λ"}</option>
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
                <Graph />
                </Row>
            </Col>
            <Col>
                <Row>
                <Chart />
                </Row>
            </Col>
            </Row>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Warning!</Modal.Title>
                </Modal.Header>
                <Modal.Body>{warning}</Modal.Body>
            </Modal>
        </div>
    )
}
  
export default NFA;