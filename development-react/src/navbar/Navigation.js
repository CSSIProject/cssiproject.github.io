import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import './nav.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

class Navigation extends Component {
    render(){
        return (
            <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
                <Navbar.Brand href="#home">Opticane</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#currentconditions">Current Conditions</Nav.Link>
                        <Nav.Link href="#forecast">Forecast</Nav.Link>
                        <Nav.Link href="#myfarm">My Farm</Nav.Link>   
                    </Nav>
                    <Nav>
                        <NavDropdown title="Info" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Definitions</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Observations</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Forecasts</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.4">Irrigweb</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.5">Climate Zones</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.6">About Us</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.6">Contact</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link eventKey={2} href="#login">
                            Log In
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Navigation;
