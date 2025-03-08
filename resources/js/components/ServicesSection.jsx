import React from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Badge,
    Image,
} from "react-bootstrap";
import "../assets/css/services.css";
import featureImage from "../assets/images/feature-image-1.jpg";
import featureImage1 from "../assets/images/feature-image-2.jpg";
import featureImage2 from "../assets/images/feature-image-3.jpg";

const ServicesSection = () => {
  return (
    <>
    <Container fluid className="first_sec_service position-relative">
        <Container className="py-5">
            <Row>
                <Col md={12} xs={12} sm={12} lg={6} className="left">
                    <Badge
                        bg="white"
                        className="align-items-center p-3 mt-5 mb-4 rounded-pill shadow-sm custom-sec-badge"
                    >
                        <span className="rounded-circle me-2 d-inline-block custom-badge-sec-content"></span>
                        Why Choose Us?
                    </Badge>
                    <h1 className="text-dark mt-3 display-2 mb-4 custom-font frst_sec_content">
                        Best Services And Expert Doctor Is Here.
                    </h1>
                    <Row className="my-5 mr-4">
                        <Col xs={12} sm={6} md={6} lg={6}>
                            <Button
                                variant="outline-light"
                                className="mb-3 w-100 rounded-pill py-4  custom-btn"
                                style={{
                                    borderColor: "#f8d5c2",
                                }}
                            >
                                Emergency Cases
                            </Button>
                        </Col>
                        <Col xs={12} sm={6} md={6} lg={6}>
                            <Button
                                variant="outline-light"
                                className="mb-3 w-100 rounded-pill py-4 btn-lg custom-btn"
                                style={{
                                    borderColor: "#f8d5c2",
                                }}
                            >
                                Modern Clinic
                            </Button>
                        </Col>
                        <Col xs={12} sm={6} md={6} lg={6}>
                            <Button
                                variant="outline-light"
                                className="mb-3 w-100 rounded-pill py-4 btn-lg custom-btn"
                                style={{
                                    borderColor: "#f8d5c2",
                                }}
                            >
                                24/7 Support
                            </Button>
                        </Col>
                        <Col xs={12} sm={6} md={6} lg={6}>
                            <Button
                                variant="outline-light"
                                className="mb-3 w-100 rounded-pill py-4 btn-lg custom-btn"
                                style={{
                                    borderColor: "#f8d5c2",
                                }}
                            >
                                Easy Online Appendment
                            </Button>
                        </Col>
                        <Col xs={12} sm={6} md={6} lg={6}>
                            <Button
                                variant="outline-light"
                                className="mb-3 w-100 rounded-pill py-4 btn-lg custom-btn"
                                style={{
                                    borderColor: "#f8d5c2",
                                }}
                            >
                                Expert Doctor's
                            </Button>
                        </Col>
                        <Col xs={12} sm={6} md={6} lg={6}>
                            <Button
                                variant="outline-light"
                                className="mb-3 w-100 rounded-pill py-4 btn-lg custom-btn"
                                style={{
                                    borderColor: "#f8d5c2",
                                }}
                            >
                                100% Secure
                            </Button>
                        </Col>
                    </Row>
                </Col>

                <Col md={6} xs={12} sm={10} className="right right_container">
                <Row>
                <Col md={8} xs={12} sm={10} className="right_right">
                <Image src={featureImage} className="rounded-pill img-fluid image_1 m-2"/>
                <Image src={featureImage1} className="rounded-circle img-fluid image_2 m-2"/>
                </Col>
                <Col md={4} xs={12} sm={10} className="d-flex">
                <Image style={{objectFit: 'cover'}} src={featureImage2} className="rounded-pill img-fluid image_3 m-2"/>
                </Col>
                </Row>
                </Col>
            </Row>
        </Container>
    </Container>
</>
  )
}

export default ServicesSection