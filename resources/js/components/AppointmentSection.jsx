import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../assets/css/main.css';
import appoinmentImg from "../assets/images/appoinment-shape.png";

const containerStyle = {
    backgroundImage: `url(${appoinmentImg})`,
    backgroundPosition: '350px',
    backgroundRepeat: 'no-repeat',
};

const outerContainerStyle = {
    position: "absolute",
    top: "250px",
    left: "0",
    width: "100%",
    height: "55%",
    zIndex: "-1",
};

const Appointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="position-relative">
      <Container fluid className="appoint_sec" style={outerContainerStyle}>
      </Container>

      <Container className="cnt-bg mt-5 position-relative">
        <Row className="align-items-center ctn-bx" style={containerStyle}>
          <Col xl={6} lg={12} sm={12} className="mt-4">
            <span className="appoinment-btn border rounded-5 txt-hd my-5">
              Contact Us
            </span>
            <h2 className="fw-bold text-light txt-bd">
              Need Assistance? Feel Free to Contact
            </h2>
          </Col>

          <Col xl={6} lg={12}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col lg={6}>
                  <Form.Group controlId="name">
                    <Form.Control
                      className="p-2 fw-bolder in-txt mb-4"
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group controlId="email">
                    <Form.Control
                      className="p-2 fw-bolder in-txt mb-4"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col lg={6}>
                  <Form.Group controlId="phone">
                    <Form.Control
                      className="p-2 fw-bolder in-txt mb-4"
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group controlId="reason">
                    <Form.Select 
                      className="p-2 fw-bolder slc-txt mb-4"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Reason</option>
                      <option value="Monthly Check-up">Monthly Check-up</option>
                      <option value="Emergency Inquiry">Emergency Inquiry</option>
                      <option value="Feedback or Complaint">Feedback or Complaint</option>
                      <option value="Medical Consultation">Medical Consultation</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="description">
                <textarea
                  className="col-12 p-2 fw-bolder slc-txt mb-4 rounded-2"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3" 
                  placeholder="Description"
                ></textarea>
              </Form.Group>

              <Button type="submit" className="theme-btn btn btn-primary px-5 py-3 txt-btn">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

    </div>
  );
};

export default Appointment;
