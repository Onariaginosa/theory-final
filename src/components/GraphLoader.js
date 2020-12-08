import React, {useState} from "react";
import Graph from "./Graph";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const GraphLoader = (props) => {

    const [data, setData] = useState(props.data);

    const update = () => {
        setData(props.data);
    }
    
    return (
        <div style={{ minWidth: "100%" }}>
            <Row>
                <Button onClick={update}>Update</Button>

            </Row>
            <Row>
            {data.map((loadData) =>
                <Graph data={ loadData }/>
            )}
            </Row>
        </div>

    );
}

export default GraphLoader;