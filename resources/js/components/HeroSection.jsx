import React from "react";
import { Container, Row, Col, Button, Badge, Image, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import doctorImage from "../assets/images/hero-image.jpg";
import brainImage from "../assets/images/brain.svg";
import lineImage from "../assets/images/line-1.png";
import { IoMdCheckmarkCircle } from "react-icons/io";
const sectionStyle = {
    backgroundImage: `url(${lineImage})`,
    backgroundPosition: 'right',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
};
const HeroSection = () => (
    <Container fluid className="first_sec_blog position-relative py-3" style={sectionStyle}>
        <Container>
            <Row className="align-items-center hero_sec_row">
                <Col md={6} xs={12} sm={10}>
                    <Badge
                        bg="white"
                        className="align-items-center p-3 rounded-pill shadow-sm custom-badge"
                    >
                        <span className="rounded-circle me-2 d-inline-block custom-badge-content"></span>
                        24/07 Emergency Service
                    </Badge>
                    <h1 className="fw-bold text-dark mt-3 display-2 custom-font frst_sec_content">
                        Doctor always <br /> ready for service.
                    </h1>
                    <ListGroup variant="flush" className="mt-3">
                        <ListGroup.Item className="text-dark-color border-0 d-flex align-items-center bg-transparent">
                            <span className="me-2"><IoMdCheckmarkCircle size={30} color="#72569D" /></span> Prescriptions & treatment plans.
                        </ListGroup.Item>
                        <ListGroup.Item className="text-dark-color border-0 d-flex align-items-center bg-transparent">
                            <span className="me-2"><IoMdCheckmarkCircle size={30} color="#72569D" /></span> Always available for emergency service.
                        </ListGroup.Item>
                        <ListGroup.Item className="text-dark-color border-0 d-flex align-items-center bg-transparent">
                            <span className="me-2"><IoMdCheckmarkCircle size={30} color="#72569D" /></span> Low visit and even less with insurance.
                        </ListGroup.Item>
                    </ListGroup>
                    <Button  as={Link} to="/onlinebook" className="mt-3 px-4 py-2 fw-bold custom-btn btn-lg">
                        Book Appointment
                    </Button>
                </Col>
                <Col xs={12} sm={10} md={6} className="text-center mt-5 hero_sec_img">
                    <Image src={doctorImage} roundedCircle className="img-thumbnail shadow-lg w-md-100" />
                    <Badge
                        bg="white"
                        className="position-absolute neurologist-badge shadow-sm"
                    >
                        <Image src={brainImage} fluid className="neurologist-icon" />
                        <p className="text-center small m-0 text-dark">Neurologist</p>
                    </Badge>
                </Col>
            </Row>
        </Container>
    </Container>
);
export default HeroSection;
