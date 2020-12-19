function TestNFA() {

  const partialAccept = (str, current, nodes, acceptStates, lambdaLoops,) => {
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
           if (partialAccept(str.substring(1), state, nodes, acceptStates)) {
             return true;
           }
         }
       }
       if (transition === "λ" && !lambdaLoops.includes(current) && nodes[current][transition].length > 0) {
         lambdaLoops.push(current);
         for (let state of nodes[current][transition]) { 
           if (partialAccept(str, state, nodes, acceptStates, lambdaLoops)) {
             return true;
           }
         }
       }
     }
     return false;
   }
  }

  const isStringAccepted = (testerString, startState, nodes, acceptStates) => {
   let str = testerString.replace(/\s+/g, '')
   str = str.replace(/λ/g, "");
   return(partialAccept(str, startState.state, nodes, acceptStates));
  }
  //language that starts with 010 and contains 11
  let nodes1 = {
    "a": { "0": ["b"] },
    "b": { "1": ["c"] },
    "c": { "0": ["d"] },
    "d": { "0": ["d"], "1": ["e", "d"] },
    "e": { "1": ["f"] },
    "f": { "0": ["f"], "1": ["f"] }
  };
  let start1 = { state: "a" };
  let accept1 = ["f" ]
  let strings1 = [
    ["", false],
    ["010", false],
    ["11", false],
    ["01010101010", false],
    ["01011", true],
    ["010001011λ0111000", true],
    ["0101110  00001", true],
    ["010000000λ01λ1000000011001λ010", true],
  ]
  // language that (starts with 0 and ends with 0) *
  let nodes2 = {
    "a": { "λ": [ "b" ]
    },
    "b": { "0": [ "c" ]
    },
    "c": { "0": [ "c", "d" ], "1": [ "c" ]
    },
    "d": { "λ": [ "a" ]
    }
  }
  let start2 = { state: "a" };
  let accept2 = ["a", "d"]
  let strings2 = [
    ["0", false],
    ["01 111010101 010101", false],
    ["01010110", true],
    ["", true],
    ["010λ 1010λ", true],
    ["100011010", false]
  ]
  // language that accepts a (0 + 1)(01)*
  let nodes3 = {
    "a": { "0": [  "b"  ],  "λ": [  "c"  ]},
    "b": { "0": [  "c"  ]},
    "c": { "1": [  "b"  ],  "λ": [  "a"  ]}
  }
  let start3 = { state: "a" };
  let accept3 = ["b"];
  let strings3 = [
    ["10101", true],
    ["00101010", false],
    ["001", true],
    ["0011", false],
    ["0", true],
    ["1", true],
    ["11", false],
    ["λ", false],
    ["", false],
    ["010101010101101010101010", false]
  ];

  let test = () => {
    for (let i = 0; i < strings1.length; i++) {
      if (strings1[i][1] !== isStringAccepted(strings1[i][0], start1, nodes1, accept1)) {
        return "failed String Tests 1"
      }
    }
    for (let i = 0; i < strings2.length; i++) {
      if (strings2[i][1] !== isStringAccepted(strings2[i][0], start2, nodes2, accept2)) {
        return "failed String Tests 2"
      }
    }
    for (let i = 0; i < strings3.length; i++) {
      if (strings3[i][1] !== isStringAccepted(strings3[i][0], start3, nodes3, accept3)) {
        return "failed String Tests 3"
      }
    }
    return "All Tests Passed!"
  }

  return test();
}

let result = TestNFA();
console.log("NFA simulator Tests: ", result )


