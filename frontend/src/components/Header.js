import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Header() {
    return (
        <header>
            <Navbar bg="light" variant="light" collapseOnSelect expand="sm">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>Frame</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <LinkContainer to="/about-us">
                                <Nav.Link>About Us</Nav.Link>
                            </LinkContainer>
                            <NavDropdown
                                title="Account"
                                id="collapsible-nav-dropdown"
                            >
                                <LinkContainer to="/my-orders">
                                    <NavDropdown.Item href="/my-orders">
                                        My Orders
                                    </NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    <i className="fa-solid fa-bag-shopping header-icon" />
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/login">
                                <Nav.Link>
                                    <i className="fa-regular fa-user header-icon" />
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/saved">
                                <Nav.Link>
                                    <i className="fa-regular fa-heart header-icon" />
                                </Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
