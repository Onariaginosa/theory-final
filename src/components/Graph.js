import React from "react";
import { Sigma, EdgeShapes, NodeShapes} from 'react-sigma';
import { DragNodes } from 'react-sigma';


const Graph = React.memo(function Graph(props) {
    let temp = {
        nodes: [
            {
                color: "white",
                id: "hidden",
                size: 25,
                x: -0.2,
                y: -0.2,
            },
            {
                color: "#45adc1",
                id: "h",
                label: "h",
                size: 25,
                type: "diamond",
                x: 0,
                y: 1
            },
            {
                color: "black",
                id: "m",
                label: "m",
                size: 20,
                x: 1,
                y: 2
            }
        ],
        edges:
            []
    };
    let take2 = { ...props.data };
    // let myGraph = data

    console.log("Sent Data: ", props.data);
    console.log("Temp Data: ", temp)

    return (
      
        <div style={{
            outline: "3px dotted #1a7081",
            width: "90%",
            margin: "50px",
            height: "600px",
            padding: "50px 50px 50px 50px",
        }}>
            <Sigma renderer="canvas" graph={props.data}
                style=
                {{
                    margin: "0",
                    justifyContent: "center",
                    display: "flex",
                    position: "static",
                    maxWidth: "inherit",
                    height: "inherit",
                }}
                settings=
                {{
                    fontStyle: "bold",
                    scalingMode: "inside",
                    drawEdges: true,
                    drawEdgeLabels: true,
                    clone: false,
                    minArrowSize: 10,
                    minNodeSize: 10,
                    maxNodeSize: 40,
                }}
                        
            >
                <EdgeShapes default="curvedArrow" />
                <NodeShapes default="circle" />
                <DragNodes />
                {/* <ForceLink background strongGravityMode={false} alignNodeSiblings={true} outboundAttractionDistribution={true}/> */}
                {/* <RandomizeNodePositions/> */}
            </Sigma>
        </div>
    )
});
  
export default Graph;
