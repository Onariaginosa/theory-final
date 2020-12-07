import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function InputForm() {

    
    return (
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
                        <Form.Control placeholder="Enter source node name" />
                    </Form.Group>
                    <Form.Group as={Col} xs={2} controlId="Transitions">
                    <Form.Label>Transition: </Form.Label>
                    <Form.Control as="select" defaultValue="Choose...">
                        <option>0</option>
                        <option>1</option>
                        </Form.Control>
                    </Form.Group>  
                    <Form.Group as={Col} controlId="TargetNode">
                        <Form.Label> Target Node: </Form.Label>    
                        <Form.Control placeholder="Enter target node name" />
                    </Form.Group>
                </Form.Row>
                <Form.Row style={{
                    justifyContent: "right",
                    margin: " 5px 5px 15px 5px",
                }}>
                    <Button variant="info">Add</Button>{' '}
                </Form.Row>
            </Form>
        </div>
    )
}

export default InputForm;