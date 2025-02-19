import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Neurology from "../assets/images/Neurology.png";
import Urology from "../assets/images/Urology.png";
import Allergy from "../assets/images/Allergy.png";
import Gastrology from "../assets/images/Gestrology.png";
import Aids from "../assets/images/Aids.png";
import Dermatology from "../assets/images/Dermatology.png";
import Otolaryngology from "../assets/images/Otolaryngology.png";
import Dentistry from "../assets/images/Dentisty.png";
import { FaArrowRight } from "react-icons/fa";

const departments = [
  { name: "Neurology", img: Neurology, link: "" },
  { name: "Urology", img: Urology, link: "" },
  { name: "Allergy", img: Allergy, link: "" },
  { name: "Gastrology", img: Gastrology, link: "" },
  { name: "HIV/AIDS", img: Aids, link: "" },
  { name: "Dermatology", img: Dermatology, link: "" },
  { name: "Otolaryngology", img: Otolaryngology, link: "" },
  { name: "Dentistry", img: Dentistry, link: "" },
];

const Department = () => {
  return (
    <Container style={{ maxWidth: "1200px" }}>      
      <Row className="justify-content-center text-center mt-5">
        <Col>
          <h2 className="fw-bold">Find The Best Department For Your Treatment</h2>
        </Col>
      </Row>      
      <Row className="mt-4 g-4">
        {departments.map((dept, index) => (
          <Col key={index} lg={3} md={4} sm={6} xs={12} className="d-flex justify-content-center">
            <Card className="department-card text-center border-light shadow-sm p-3">
              <div className="icon-wrapper">
                <Card.Img variant="top" src={dept.img} alt={dept.name} className="img-fluid" />
              </div>
              <Card.Body>
                <Card.Title className="fs-5 fw-bold">{dept.name}</Card.Title>
              </Card.Body>
              <a href={dept.link} className="arrow-button">
                <FaArrowRight size={30} />
              </a>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Department;
