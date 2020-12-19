

function TestDFAmin() {

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

  const sameBehavior = (x, y) => {
    for (let key in x) {
      if (y[key] !== x[key]) {
        return false;
      } 
    }
    return true;
  }

  const getCurrentBehavior = (node, groups, nodes) => {
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

  const matchBehaviors = (currentBehavior, groupBehaviors, currentAccept, acceptList) => {
    for (let behavior in groupBehaviors) {
      if (groupBehaviors[behavior]["0"] === currentBehavior["0"] && groupBehaviors[behavior]["1"] === currentBehavior["1"]) {
        if (acceptList.includes(behavior) === currentAccept) {
          return behavior;
          
        }
      }
    }
    return -1;
  }

  const minimizeGraph = (nodes, acceptStates, startState) => {
    let oldgroups = {};
    let newgroups = {};
    let groupBehaviors = {};
    let generalBehaviors = {}
    let temp;
    let groupCount = 2;
    let name
    let currentAccepts = ["0",];
    let lett;

    // split between accept states and non accept states
    newgroups[0] = [...acceptStates];
    newgroups[1] = [];
    for (let node in nodes) {
      if (!acceptStates.includes(node)) {
        newgroups[1].push(node);
      }
    }
    // loopin time (until old graph and new graph are the same)
    while (!sameGroup(oldgroups, newgroups)) {
      oldgroups = { ...newgroups };
      newgroups = {};
      groupBehaviors = {}
      generalBehaviors = {}
      // set group Behaviors
      for (let group in oldgroups) {
        for (let node of oldgroups[group]) {
          name = group + node;
          groupBehaviors[name] = getCurrentBehavior(node, oldgroups, nodes);
        }
      }
      // split groups by behavior
      for (let group in oldgroups) {
        for (let node of oldgroups[group]) {
          name = group + node;
          if (newgroups[group] === undefined) {
            newgroups[group] = [node]
            generalBehaviors[group] = groupBehaviors[name]
          } else if (sameBehavior(groupBehaviors[name], generalBehaviors[group])) {
            newgroups[group].push(node);
          } else {
            lett = group + "";
            temp = matchBehaviors(groupBehaviors[name], generalBehaviors, currentAccepts.includes(lett), currentAccepts);
            if (temp === -1) {
              if (currentAccepts.includes(lett)) {
                lett = groupCount + "";
                currentAccepts.push(lett);
              }
              newgroups[groupCount] = [node];
              generalBehaviors[groupCount] = groupBehaviors[name]
              groupCount++;
            } else {
              newgroups[temp].push(node);
            }
          }
        }
      }
    }
    // we have our groups now we make the minimized nodes and transitions
    let newNodes = {}
    let newName, newTarget, trans;
    let minAccepts = []
    let minStart
    for (let behavior in generalBehaviors) {
        newName = newgroups[behavior].join("");
        newNodes[newName] = {}
        if (newgroups[behavior].includes(startState.state)) {
          minStart = { state: newName };
        }
        if (acceptStates.includes(newgroups[behavior][0])) {
          minAccepts.push(newName);
        }
        for (let i = 0; i <= 1; i++) {
          trans = "" + i;
          newTarget = newgroups[generalBehaviors[behavior][trans]];
          newNodes[newName][trans] = newTarget ? newTarget.join(""): "";
        }
    }
    return {
      og: {
        states: nodes,
        accept: acceptStates,
        start: startState
      },
      min: {
        states: newNodes,
        accept: minAccepts,
        start: minStart
      }
    }
  }

  // Example from Quiz 3
  let nodes1 = {  
    a: { 0: "e", 1: "m" },
    e: { 0: "n", 1: "g" },
    g: { 0: "k", 1: "g" },
    k: { 0: "m", 1: "n" },
    m: { 0: "m", 1: "k" },
    n: {0: "k", 1: "m"}
  }
  let minNodes1 = {
    a: { 0: "eg", 1: "kmn" },
    eg: { 0: "kmn", 1: "eg" },
    kmn: {0: "kmn", 1: "kmn"},
  }
  let accepts1 = ["e", "g"];
  let minAccepts1 = ["eg"];
  let start1 = { state: "a" };
  let minStart1 = { state: "a" };

  // Example from Quiz 3
  let nodes2 = {
    a: { 0: "b", 1: "c" },
    b: { 0: "d", 1: "m" },
    c: { 0: "f", 1: "m" },
    d: { 0: "m", 1: "e" },
    e: { 0: "n", 1: "m" },
    f: { 0: "k", 1: "g" },
    g: { 0: "k", 1: "k" },
    k: { 0: "k", 1: "k" },
    m: { 0: "m", 1: "n" },
    n: { 0: "m", 1: "n" },
  }
  let minNodes2 = {
    a: { 0: "bc", 1: "bc" },
    bc: { 0: "df", 1: "kmn" },
    df: { 0: "kmn", 1: "eg" },
    eg: { 0: "kmn", 1: "kmn" },
    kmn: { 0: "kmn", 1: "kmn" },
  }
  let accepts2 = ["e", "g"];
  let minAccepts2 = ["eg"];
  let start2 = { state: "a" };
  let minStart2 = { state: "a" };

  let compare1 = minimizeGraph(nodes1, accepts1, start1)
  let compare2 = minimizeGraph(nodes2, accepts2, start2);

  const tests = () => {
    // Test 1
    if (compare1.min.start.state !== minStart1.state) {
      return  "Test 1 failed start tests";
    }
    if (compare1.min.accept.length !== minAccepts1.length) {
      return  "Test 1 failed accept states tests";
    }
    if (Object.keys(compare1.min.states).length !== Object.keys(minNodes1).length) {
      return  "Test 1 failed node tests";
    }
    for (let accept of minAccepts1) {
      if (!compare1.min.accept.includes(accept)) {
        return  "Test 1 failed accept state tests";
      }
    }
    for (let state in compare1.min.states) {
      if (Object.keys(minNodes1).includes(state)) {
        for (let transition in minNodes1[state]) {
          if (minNodes1[state][transition] !== compare1.min.states[state][transition]) {
            return  "Test 1 failed node testing";
          }
        }
      } else {
        return  "Test 1 failed state testing";
      }
    }
    // Test 2
    if (compare2.min.start.state !== minStart2.state) {
      return  "Test 2 failed start tests";
    }
    if (compare2.min.accept.length !== minAccepts2.length) {
      return  "Test 2 failed accept states testing";
    }
    if (Object.keys(minNodes2).length !== Object.keys(minNodes2).length) {
      return "Test 2 failed node tests";
    }
    for (let accept of minAccepts2) {
      if (!compare2.min.accept.includes(accept)) {
        return  "Test 2 failed accept state tests" +compare2.min.accept.join(",");
      }
    }
    for (let state in compare2.min.states) {
      if (Object.keys(minNodes2).includes(state)) {
        for (let transition in minNodes2[state]) {
          if (minNodes2[state][transition] !== compare2.min.states[state][transition]) {
            return  "Test 2 failed node testing";
          }
        }
      } else {
        return  "Test 2 failed state testing";
      }
    }
    return "All Tests Pass";
  }

  return (tests());
}

let result = TestDFAmin();

console.log("DFA minimizer Tests: ", result )
