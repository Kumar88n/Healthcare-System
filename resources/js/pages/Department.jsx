import React from "react";
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/main.css";
import HeaderNavbar from "../components/HeaderNavbar";
import HeaderImage from "../assets/images/page-title.jpg";

export default function Department() {
    const { departmentName } = useParams();

    return (
        <>
            <HeaderNavbar />
            <Container
                fluid
                className="d-flex flex-column align-items-center justify-content-center text-center py-5 bg-light"
                style={{
                    backgroundImage: `url(${HeaderImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "380px",
                }}
            >
                <h2 className="fw-bold text-dark-color custom-font display-4">{departmentName.charAt(0).toUpperCase() + departmentName.slice(1)}</h2>
            </Container>
        </>
    );
};