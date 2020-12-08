import React, { useState } from "react";
import Graph from "../Graph";
import "../../App.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


function NFA() {
    // graph is in the format 
    // { source id / name: [λ transition targets[], 0 transition target, 1 transition target], }
    // let graph = {};
    // are in the form [ {name: boolean if accept}]
    // let nodes = [];let temp = [[], [], []];
    // edges are in the form [{source:[target, transition]}]
    // let edges = [];

    const transitionIndex = { "λ": 0, "0": 1, "1": 2 };

    const [graph, setGraph] = useState({});

    const [startState, setStartState] = useState({state:""});

    const [nodes, setNodes] = useState([]);

    const [edges, setEdges] = useState([]);

    const [transition, setTransition] = useState("0");
    const [source, setSource] = useState("");
    const [target, setTarget] = useState("");
    const [warning, setWarning] = useState("");
    const [show, setShow] = useState(false);

    let default_data = {};
    let hidden_node = { id: "hidden", color: "red", size: 25, x: -0.2, y: -0.2 };
    default_data.nodes = [];
    default_data.edges = [];
    default_data.nodes.push(hidden_node);

    const [data, setData] = useState({ ...default_data });

    const handleClose = () => {
        setShow(false);
        setWarning("");
    };

    const handleStartState = (id) => {
        let newState = { state: id };
        setStartState({...newState});
    }

    const handleAcceptState = (id) => {
        for (let node of nodes) {
            if (typeof node[id] === "boolean" ) {
                node[id] = !node[id];
            } else {
            }
        }

    }

    const generateData = () => {



        let tempData = { ...default_data };
        let interNode, interEdge;
        let x = 0, y = 1;
        let edgeId = "e";
        let count = 0;


        // source id / name: [λ transition targets[], 0 transition target, 1 transition target],

        for (const [src, transitionMap] of Object.entries(graph)) {
            console.log(`${src}: ${transitionMap}`);
            interNode = {}
            interNode.id = src;
            interNode.label = src;
            if (src === startState.state) {
                interNode.size = 25;
                interNode.type = "diamond"
                interNode.color = "#45adc1"
            } else {
                interNode.size = 20;
                interNode.color = "black"
            }
            interNode.x = x;
            interNode.y = y;
            tempData.nodes.push(interNode);
            x++;
            y++;

          }





        // nodes.forEach((node) => {
        //     interNode = {}
        //     interNode.id = Object.keys(node).join("");
        //     interNode.label = interNode.id;
        //     if (node[interNode.id]) {
        //         interNode.size = 25;
        //         interNode.type = "diamond"
        //         interNode.color = "#45adc1"
        //     } else {
        //         interNode.size = 20;
        //         interNode.color = "black"
        //     }
        //     interNode.x = x;
        //     interNode.y = y;
        //     tempData.nodes.push(interNode);
        //     x++;
        //     y++;
        // });
        // edges.forEach((edge) => {
        //     for (let src in edge) {
        //         interEdge = {};
        //         interEdge.id = edgeId + count;
        //         interEdge.source = src;
        //         interEdge.target = edge[src][0];
        //         interEdge.label = edge[src][1];
        //         interEdge.color = "grey";
        //         tempData.edges.push(interEdge); 
        //         if (src === startState) {
        //             interEdge = {};
        //             interEdge.id = "start";
        //             interEdge.source = "hidden";
        //             interEdge.target = src;
        //             interEdge.color = "grey";
        //             interEdge.type = "arrow"
        //             tempData.edges.push(interEdge); 
        //         }
        //         count++;
        //     }
        // })




        setData({ ...tempData })

    }

    const handleRemoveState = (id) => {
        let rubbish = [];
        let trash = [];
        let newNodes = nodes.filter(node => node[id] === undefined);
        setNodes([...newNodes]);

        let newEdges = edges.filter(edge => edge[id] === undefined);
        for (let edge of newEdges) {
            // Only one key so it doesnt actually loop
            for (let key in edge) {
                if (edge[key][0] === id) {
                    trash.push(edge)
                }
            }
        }
        newEdges.filter(edge => !trash.includes(edge));
        setEdges([...newEdges]);

        let newGraph = graph;
        for (let entry of Object.entries(newGraph)) {
            if (entry[0] === id) {
                rubbish.push(entry)
            } else {
                for (let trans of entry[1]) {
                    trans = trans.filter(n => n!==id )
                }
            }
        }
        setGraph({...newGraph})
    }

    const sameArray = (a1, a2) => {

        if (a1 === undefined || !Array.isArray(a1) || !Array.isArray(a2) || a1.length !== a2.length) {
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
        if (o1 !== undefined&& o2 !== undefined && o1.size === o2.size) {
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
                    if (Array.isArray(object[key]) && sameArray(inside[key], object[key])){
                        broke = true;
                        break;
                    } else if (typeof object[key] === "object" && sameObject(object[key], inside[key])) {
                        broke = true;
                        break;
                    } else if (object[key] === inside[key]) {
                        broke = true;
                        break;
                    } else if (typeof object[key] === "boolean" && typeof inside[key] === "boolean") {
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

    const handleUpdateGraph = (n, e) => {
        let tempGraph = {}
        let temp;
        let applicableEdges;
        for (let node of n) {
            // this does not loop. There is only one key
            for (let name in node) {
                temp = [[], [], []];
                tempGraph[name] = temp;
                applicableEdges = e.filter(edg => edg[name] !== undefined);
                // eslint-disable-next-line no-loop-func
                applicableEdges.forEach((applicableEdge) => {
                    for (let src in applicableEdge) {
                        // yikes that looks so ugly! might fix if i regain will to live
                        temp[transitionIndex[applicableEdge[src][1]]].push(applicableEdge[src][0]);
                    }
                });
                tempGraph[name] = temp;
            }
        }
        setGraph({ ...tempGraph });
        generateData();
    }
    
    const handleAdd = () => {
        let newNodes = [...nodes];
        let newEdges = [...edges];
        setSource(source.replace(/\s+/g, ''));
        setTransition(transition.replace(/\s+/g, ''));
        if (transition === "" || source === "" || target === "") {
            setWarning("Invalid entry try again");
            handleShow();
        } else {
            let edge = {}
            edge[source] = [target, transition];
            let temp1 = {}
            temp1[source] = false;
            let temp2 = {}
            temp2[target] = false;
            if (startState.state === "") {
                handleStartState(source);
            }
            if (!objectInList(newNodes, temp1)) {
                newNodes.push(temp1);
                if (source !== target && !objectInList(nodes, temp2)) {
                    newNodes.push(temp2);
                }
                newEdges.push(edge);
                setNodes([...newNodes]);
                setEdges([...newEdges]);
                handleUpdateGraph(newNodes, newEdges);
                return;
            } else if (!objectInList(newNodes, temp2)) {
                newNodes.push(temp2);
                newEdges.push(edge);
                setNodes([...newNodes]);
                setEdges([...newEdges]);
                handleUpdateGraph(newNodes, newEdges);
                return
                
            } else if (!objectInList(newEdges, edge)) {
                newEdges.push(edge);
                setEdges([...newEdges]);
                handleUpdateGraph(newNodes, newEdges);
                return;
            }
        }
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
            <Col xs={7}>
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
                            <Graph data={ data }/>
                </Row>
            </Col>
            <Col>
                <Row>
                    <div style={{
                        outline: "3px dotted #1a7081",
                        width: "90%",
                        margin: "50px",
                        padding: "50px 50px 50px 50px",
                    }}>
                        <Table striped style={{
                        }}>
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
                                    {Object.entries(graph).map((state) => (
                                    <tr>
                                        <td>{state[0]}</td>
                                        <td>{state[1][0]?state[1][0].join(' ') : " "}</td>
                                        <td>{state[1][1]?state[1][1].join(' '): " " }</td>
                                        <td>{state[1][2]?state[1][2].join(' '): " " }</td>
                                        <td>
                                            <Button variant="info" id={`S${state[0]}`} onClick={() => handleStartState(state[0])}>
                                                Start State
                                            </Button>{' '}
                                            <Button variant="info" id={`A${state[0]}`} onClick={() => handleAcceptState(state[0])}>
                                                Accept State
                                            </Button>{' '}
                                            <Button variant="danger" id={`R${state[0]}`} onClick={() => handleRemoveState(state[0])}>
                                                Remove State
                                            </Button>{' '}
                                        </td>
                                    </tr>

                                ))}
                                
                            </tbody>
                        </Table>
                    </div>
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