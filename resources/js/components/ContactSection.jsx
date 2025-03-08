import React from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Badge,
    Card,
    Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import HeaderNavbar from "./HeaderNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/main.css";
import errorBgImage from "../assets/images/page-title.jpg";

const Contact = () => {
    return (
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
                <h2 className="text-dark-color custom-font display-4">
                    Online Booking
                </h2>
                <p>
                    <Link
                        to="/"
                        className="text-decoration-none text-dark-color"
                    >
                        <span>Home</span>
                    </Link>{" "}
                    // <span>Online Booking</span>
                </p>
            </Container>

            <Container className="text-center my-5">
                <Card className="my-5 shadow" style={{ border: "none" }}>
                    <Card.Body>
                        <Row className="justify-content-center">
                            <Col md={8}>
                                <Badge
                                    bg="#EFEBFF"
                                    className="align-items-center p-3 mt-5 rounded-pill shadow-sm custom-badge my-4"
                                    style={{ backgroundColor: ["#EFEBFF"] }}
                                >
                                    <span className="rounded-circle me-2 d-inline-block custom-badge-content"></span>
                                    Appointment Now
                                </Badge>
                                <h1
                                    className="text-dark-color custom-font my-3"
                                    style={{ fontSize: ["50px"] }}
                                >
                                    Appointment for free <br /> online
                                    consulation.
                                </h1>
                                <Form className="my-5">
                                    <Row className="mb-3">
                                        <Col md={6} sm={12} className="my-2">
                                            <Form.Group
                                                as={Col}
                                                controlId="formGridName"
                                            >
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Full Name"
                                                    className="py-4"
                                                    style={{
                                                        border: "2px solid #584F88",
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6} sm={12} className="my-2">
                                            <Form.Group
                                                as={Col}
                                                controlId="formGridEmail"
                                            >
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Email"
                                                    className="py-4"
                                                    style={{
                                                        border: "2px solid #584F88",
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3">
                                        <Col md={6} sm={12} className="my-2">
                                            <Form.Group
                                                as={Col}
                                                controlId="formGridPhone"
                                            >
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Phone Number"
                                                    className="py-4"
                                                    style={{
                                                        border: "2px solid #584F88",
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} sm={12} className="my-2">
                                            <Form.Group
                                                className="mb-3"
                                                controlId="formGridReason"
                                            >
                                                <Form.Select
                                                    defaultValue="Choose Reason"
                                                    className="py-4"
                                                    style={{
                                                        border: "2px solid #584F88",
                                                    }}
                                                >
                                                    <option value="">
                                                        Choose Reason
                                                    </option>
                                                    <option value="support">
                                                        Technical Support
                                                    </option>
                                                    <option value="billing">
                                                        Billing Issue
                                                    </option>
                                                    <option value="feedback">
                                                        General Feedback
                                                    </option>
                                                    <option value="other">
                                                        Other
                                                    </option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group
                                        className="mb-3"
                                        controlId="formGridMessage"
                                    >
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            placeholder="Your Message"
                                            className="py-4"
                                            style={{
                                                border: "2px solid #584F88",
                                            }}
                                        />
                                    </Form.Group>

                                    <Button
                                        variant="transparent"
                                        className="fw-bold btn btn-lg py-4 px-5 fs-6 my-2 online_btn"
                                        type="submit"
                                        style={{
                                            border: "2px solid #72569D",
                                            borderRadius: ["4px"],
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Contact;
