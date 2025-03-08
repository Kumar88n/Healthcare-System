import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/main.css";
import logo from "../assets/images/logo.svg";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaAngleDoubleRight } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer_sec py-4">
            <Container>
                <Row>
                    <Col md={4}>
                        <h3 className="fw-bold text-dark">
                            <Image src={logo} style={{ height: "40px" }} />
                        </h3>
                        <p className="text-muted">
                            If you're looking for a medical theme, Dotus is the number #1 Theme for professional healthcare solutions.
                        </p>
                    </Col>
                    <Col md={1}>
                    </Col>
                    <Col md={2}>
                        <h5 className="fw-bold text-dark">Useful Links</h5>
                        <ul className="list-unstyled">
                            {[
                                { name: "About Us", path: "/about" },
                                { name: "Services", path: "/services" },
                                { name: "Department", path: "/department" },
                                { name: "Contact", path: "/contact" },
                                { name: "Latest News", path: "/news" },
                            ].map((link, index) => (
                                <li key={index} className="d-flex align-items-center">
                                    <FaAngleDoubleRight className="me-2 text-warning" />
                                    <Link to={link.path} className="text-muted text-decoration-none">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Col>
                    <Col md={1}>
                    </Col>
                    <Col md={4}>
                        <h5 className="fw-bold text-dark">Our Address</h5>
                        <p className="text-muted">Would you have any enquiries? Please feel free to contact us.</p>
                        <ul className="list-unstyled">
                            <li className="text-muted d-flex align-items-center">
                                <FaMapMarkerAlt className="me-2 text-dark" />
                                Rival Solutions Anaj Mandi Road Barnala, Punjab-148101
                            </li>
                            <li className="text-muted d-flex align-items-center">
                                <FaPhoneAlt className="me-2 text-dark" />
                                <a href="tel:+91 01679-233927" className="text-muted text-decoration-none">
                                    +91 01679-233927
                                </a>
                            </li>
                            <li className="text-muted d-flex align-items-center">
                                <FaEnvelope className="me-2 text-dark" />
                                <a href="mailto:rivalsolutions@gmail.com" className="text-muted text-decoration-none">
                                    rivalsolutions@gmail.com
                                </a>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
