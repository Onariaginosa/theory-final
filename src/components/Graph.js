import React from "react";
import { Sigma, EdgeShapes, NodeShapes, RandomizeNodePositions, RelativeSize } from 'react-sigma';
import ForceLink from 'react-sigma/lib/ForceLink';
import { DragNodes } from 'react-sigma';

function Graph(data) {
    let temp = {
        nodes: [
            { id: "hidden", color: "white", size: 25, x:-0.2, y: -0.2},
            { id: "n1", label: "Alice", size: 20, color: "#45adc1", x:0, y:0},
            { id: "n2", label: "Rabbit", size: 25, type: "", color:"red", x:1, y:0}
        ],
        edges:
            [
                { id: "e1", source: "n1", target: "n2", label: "0, 1", color: "black"},
                { id: "e2", source: "hidden", target: "n1", color: "black", type:"arrow" },
                { id: "e3", source: "n2", target: "n2", label: "0,1", color: "black"},
            ]
    };
    // let myGraph = data;

    return (
      
        <div style={{
            outline: "3px dotted #1a7081",
            width: "90%",
            margin: "50px",
            height: "600px",
            padding: "50px 50px 50px 50px",
        }}>
            <Sigma renderer="canvas" graph={temp}
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
                <EdgeShapes default="curvedArrow"/>
                <NodeShapes default="circle" />
                <DragNodes />
                {/* <ForceLink background strongGravityMode={false} alignNodeSiblings={true} outboundAttractionDistribution={true}/> */}
                {/* <RandomizeNodePositions/> */}
            </Sigma>
        </div>
    )
}
  
export default Graph;
