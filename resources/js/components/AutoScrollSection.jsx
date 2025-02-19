import React from "react";
import Slider from "react-slick";
import { Container, Row, Col } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoStarOutline } from "react-icons/io5";

const AutoScrollCarousel = () => {
    const settings = {
        infinite: true,
        autoplay: true,
        slidesToShow: 10,
        slidesToScroll: 1,
        pauseOnHover: false,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    centerPadding: "10px"
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            }
        ]
    };

    return (
        <Container fluid style={{ background: "#fde8dc", overflow: "hidden", padding: "35px" }}>
            <Row>
                <Col md={12}>
                    <Slider {...settings}>
                        <h4 className="text-dark custom-font slider_content_font">Medical</h4>
                        <IoStarOutline size={40} color="#18192b" />
                        <h4 className="text-dark custom-font slider_content_font">Doctors</h4>
                        <IoStarOutline size={40} color="#18192b" />
                        <h4 className="text-dark custom-font slider_content_font">Treatment</h4>
                        <IoStarOutline size={40} color="#18192b" />
                        <h4 className="text-dark custom-font slider_content_font">Patient</h4>
                        <IoStarOutline size={40} color="#18192b" />
                        <h4 className="text-dark custom-font slider_content_font">Hospital</h4>
                        <IoStarOutline size={40} color="#18192b" />
                    </Slider>
                </Col>
            </Row>
        </Container>
    );
};

export default AutoScrollCarousel;
