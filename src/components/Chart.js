import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import React from 'react-bootstrap';


function Chart() {

    return (
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
                        <th>0</th>
                        <th>1</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>A</td>
                        <td>B</td>
                        <td>A</td>
                        <td>
                            <Button variant="info" id="A_accept">Accept State</Button>{' '}
                            <Button variant="danger" id="A_remove">Remove State</Button>{' '}
                        </td>
                    </tr>
                    <tr>
                        <td>B</td>
                        <td>C</td>
                        <td>A</td>
                        <td>
                            <Button variant="info" id="A_accept">Accept State</Button>{' '}
                            <Button variant="danger" id="A_remove">Remove State</Button>{' '}
                        </td>
                    </tr>
                    <tr>
                        <td>C</td>
                        <td >C</td>
                        <td>C</td>
                        <td>
                            <Button variant="info" id="A_accept">Accept State</Button>{' '}
                            <Button variant="danger" id="A_remove">Remove State</Button>{' '}
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>

    )
}

export default Chart;