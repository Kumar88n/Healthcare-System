import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { Container, Row, Col, Image } from "react-bootstrap";
import Odometer from "react-odometerjs";
import { IoAdd } from "react-icons/io5";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/css/testimonial.css";
import "../assets/css/odometer-theme-minimal.css";

import testallan from "../assets/images/Allan-Roberson.jpg";
import testallan1 from "../assets/images/Dr.-Raquel-Riley-1.jpg";

const Testimonial = () => {
    const [count, setCount] = useState(0);
    const targetNumber = 6000;
    const counterRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setCount(targetNumber), 100);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const settings = {
        dots: true,
        fade: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false
    };

    const testimonials = [
        {
            image: testallan,
            text: "The staff was attentive and professional, ensuring a comfortable experience. The doctor's expertise and compassion were evident. The facility was clean and well-equipped.",
            name: "Allan Roberson",
            position: "Medicine Doctor"
        },
        {
            image: testallan1,
            text: "The staff was attentive and professional, ensuring a comfortable experience. The doctor's expertise and compassion were evident. The facility was clean and well-equipped.",
            name: "Dr. Raquel Riley",
            position: "Restorative Dentist"
        }
    ];

    return (
        <Container fluid className="first_sec_service testimonial_main">
            <Container className="py-5 testimonial">
                <Row>
                    <Col md={12} lg={3} className="left d-flex flex-column justify-content-center gap-3 px-3">
                        <p>
                            <span className="test_badge py-3 px-5 rounded-pill">
                                Testimonial
                            </span>
                        </p>
                        
                        <h1 ref={counterRef} style={{ color: "#1E144F", fontSize: "55px" }}>
                            <Odometer className="custom-font" value={count} format="(,ddd)" duration={3000} />
                            <IoAdd />
                        </h1>
                        <h3 style={{ color: "#1E144F" }}>Patient's all around the world.</h3>
                    </Col>

                    <Col md={12} lg={9} className="right">
                        <div className="slider-container position-relative">
                            <Slider {...settings}>
                                {testimonials.map((testimonial, index) => (
                                    <div key={index}>
                                        <Row className="align-items-center">
                                            <Col lg={4} className="d-flex flex-column align-items-center gap-3 right_1">
                                                <Image src={testimonial.image} className="rounded-circle img-fluid" style={{ border: "5px solid #ffffff", padding: "10px", backgroundColor: "#ffffff" }} />
                                            </Col>
                                            <Col lg={8} className="px-5 d-flex flex-column justify-content-center right_2">
                                                <h5 style={{ color: "#5F5976", marginInlineStart: "10%" }}>{testimonial.text}</h5>
                                                <h3 style={{ marginInlineStart: "10%" }} className="pt-2">{testimonial.name}</h3>
                                                <p style={{ color: "#736A98", marginInlineStart: "10%" }}>{testimonial.position}</p>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default Testimonial;
