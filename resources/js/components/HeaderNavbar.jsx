import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Button, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/images/logo.svg";

const HeaderNavbar = () => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(window.scrollY);
    const location = useLocation();
   
    useEffect(() => {
        document.onscroll = () => {
            setShowNavbar(window.scrollY < lastScrollY);
            setLastScrollY(window.scrollY);
        };
        return () => {
            document.onscroll = null;
        };
    }, [lastScrollY]);
    const hideLoginButton = location.pathname === "/login" || location.pathname === "/register";

    return (
        <Navbar expand="lg" className={`custom-navbar ${showNavbar ? "nav-visible" : "nav-hidden"}`}>
            <Container fluid>
                <Navbar.Brand as={Link} to="/">
                    <Image src={logo} style={{ height: "40px" }} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="mx-auto w-100 justify-content-center">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <NavDropdown title="Department" id="department-dropdown">
                            <NavDropdown.Item as={Link} to="/">Department</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/">Department Single</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
                        <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                {!hideLoginButton && (
                    <Button as={Link} to="/login" className="custom-btn btn-lg">
                        Login
                    </Button>
                )}
            </Container>
        </Navbar>
    );
};

export default HeaderNavbar;
