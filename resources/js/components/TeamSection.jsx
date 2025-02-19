import React from "react";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import doctorImage1 from "../assets/images/dr1.jpg";
import doctorImage2 from "../assets/images/dr2.jpg";
import doctorImage3 from "../assets/images/dr3.jpg";
import "../assets/css/main.css";

const doctors = [
  { name: "Dr. Allison", specialty: "Restorative Dentist", image: doctorImage1 },
  { name: "Dr. Raquel Riley", specialty: "Cosmetic Surgeon", image: doctorImage2 },
  { name: "Dr. Katrina", specialty: "Cancer Specialist", image: doctorImage3 },
];

const TeamSection = () => {
  return (
    <Container className="text-center my-5">
      <Badge className="pill-button badge rounded-5 bg-light text-dark shadow custom-badge-team-member mb-4">Meet Great Doctor’s</Badge>
      <h2 className="fw-bold text-dark m-md-5 custom-font display-3 team_sec_cntnt">High Qualified Doctor’s</h2>
      <Row>
        {doctors.map((doctor, index) => (
          <Col md={4} sm={6} key={index} className="mb-4 d-flex justify-content-center">
            <Card className="doctor-card shadow-lg border-0 text-center">
              <div className="image-container">
                <Card.Img variant="top" src={doctor.image} className="doctor-image" />
              </div>
              <Card.Body>
                <Card.Title className="fw-bold  dr_names">{doctor.name}</Card.Title>
                <Card.Text className="text-muted">{doctor.specialty}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TeamSection;

