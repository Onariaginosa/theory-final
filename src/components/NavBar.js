import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logo from "../images/namedLogo.png";
import NavDropdown from "react-bootstrap/NavDropdown";

function NavBar() {

  return (
    <div>
      <div>
        <Navbar bg="light" variant="light">
            <Navbar.Brand href="#">
            <img
                src={logo}
                width="70"
                height="70"
                className="d-inline-block align-top"
                alt="Ona"
            />
              </Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#nfa">NFA Simulator</Nav.Link>
            <Nav.Link href="#dfa-mini">DFA minimizer</Nav.Link>
            </Nav>
        </Navbar>

      </div>
    </div>
    )
}
  
export default NavBar;