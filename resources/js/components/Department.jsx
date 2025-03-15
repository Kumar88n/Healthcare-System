import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsArrowRightCircleFill } from "react-icons/bs";
import '../assets/css/Department.css';
import Neurology from "../assets/images/Neurology.png";
import Urology from "../assets/images/Urology.png";
import Allergy from "../assets/images/Allergy.png";
import Gastrology from "../assets/images/Gestrology.png";
import Aids from "../assets/images/Aids.png";
import Dermatology from "../assets/images/Dermatology.png";
import Otolaryngology from "../assets/images/Otolaryngology.png";
import Dentistry from "../assets/images/Dentisty.png";

const departments = [
  { name: "Neurology", img: Neurology, link: "/department/neurology" },
  { name: "Urology", img: Urology, link: "/department/urology" },
  { name: "Allergy", img: Allergy, link: "/department/allergy" },
  { name: "Gastrology", img: Gastrology, link: "/department/gastrology" },
  { name: "HIV/AIDS", img: Aids, link: "/department/hiv" },
  { name: "Dermatology", img: Dermatology, link: "/department/dermatology" },
  { name: "Otolaryngology", img: Otolaryngology, link: "/department/otolaryngology" },
  { name: "Dentistry", img: Dentistry, link: "/department/dentistry" },
];

const Department = () => {
  return (
    <Container className="" style={{ maxWidth: '1200px' }}>
      <Row className="justify-content-center hd_sec hd_p">
        <Col>
          <div className="rounded-pill hd_fnt m-auto mt-5" >
            <span className=" ">Department & Doctors</span>
          </div>
          <h2 className="h2_fnt">Find The Best Department For Your Treatment.</h2>
        </Col>
      </Row>

      <Row className="department-doctor-wrap ">
        {departments.map((dept, index) => (
          <Col key={index} lg={3} md={4} sm={6} xs={12} className=" d-flex justify-content-center g-4">
            <div className="department-single dept_btm d-flex flex-column align-items-center justify-content-center text-center pb-4 department-box mb-3 px-1" >
              <div className="dept_img_br d-flex align-items-center justify-content-center">
                <img decoding="async" src={dept.img} alt={dept.name} className="img-fluid" />
              </div>
              <h2 className="dept_hd mt-2 fs-4 fw-bold">{dept.name}</h2>
              <div class="position-relative">
                <a href={dept.link}>
                  <BsArrowRightCircleFill color=' #72569D' size={55} className="fs-2 px-2 pb-1 btn-pos position-absolute top-100 start-50 translate-middle" />
                </a>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Department;