import React from "react";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
import doctorImage1 from "../assets/images/dr1.jpg";
import doctorImage2 from "../assets/images/dr2.jpg";
import doctorImage3 from "../assets/images/dr3.jpg";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaPinterestP } from "react-icons/fa";
import "../assets/css/main.css";

const doctors = [
  { name: "Dr. Raquel Riley", specialty: "Restorative Dentist", image: doctorImage1 },
  { name: "Dr. Allison", specialty: "Cosmetic Surgeon", image: doctorImage2 },
  { name: "Dr. Katrina", specialty: "Cancer Specialist", image: doctorImage3 },
];

const TeamSection = () => {
  return (
    <Container className="text-center my-5">
      <Badge className="pill-button badge rounded-5 bg-light text-dark shadow custom-badge-team-member mb-4">
        Meet Great Doctors
      </Badge>
      <h2 className="fw-bold text-dark m-md-5 custom-font display-3 team_sec_cntnt">
        Highly Qualified Doctors
      </h2>
      <Row>
        {doctors.map((doctor, index) => (
          <Col md={4} sm={6} key={index} className="mb-4 d-flex justify-content-center">
            <Card className="doctor-card text-center border-2">
              <div className="image-container">
                <Card.Img
                  variant="top"
                  src={doctor.image}
                  className="doctor-image"
                />
                <div className="social-icons">
                  <Link to="#" className="social-link"><FaFacebookF /></Link>
                  <Link to="#" className="social-link"><FaTwitter /></Link>
                  <Link to="#" className="social-link"><FaLinkedinIn /></Link>
                  <Link to="#" className="social-link"><FaPinterestP /></Link>
                </div>
              </div>
              <Card.Body>
                <Card.Title className="dr_names custom-font">{doctor.name}</Card.Title>
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
