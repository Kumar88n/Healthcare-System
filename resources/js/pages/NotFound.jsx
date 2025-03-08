import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/main.css";
import HeaderNavbar from "../components/HeaderNavbar";
import errorBgImage from "../assets/images/page-title.jpg";

const NotFound = () => (
    <>
        <HeaderNavbar />        
        <Container
            fluid
            className="d-flex flex-column align-items-center justify-content-center text-center py-5 bg-light"
            style={{
                backgroundImage: `url(${errorBgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "380px",
            }}
        >
            <h2 className="fw-bold text-dark-color custom-font display-4">404 Error</h2>
        </Container>        
        <Container className="text-center my-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <h1 className="fw-bold text-dark-color custom-font" style={{fontSize: "10rem"}}>404</h1>
                    <h3 className="fw-bold text-dark-color custom-font">Oops! Page Not Found!!</h3>
                    <p className="text-muted">
                        We are sorry, but we cannot seem to find the page you requested.
                        This might be because you have typed the web address incorrectly.
                    </p>
                    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        <Button className="px-4 py-2 custom-btn">
                            BACK TO HOME
                        </Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    </>
);

export default NotFound;
