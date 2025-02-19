import React from "react";
import { Card, Container, Row, Col, Badge, Button } from "react-bootstrap";
import blogImage1 from "../assets/images/grid-post-1.jpg";
import blogImage2 from "../assets/images/grid-post-2.jpg";
import blogImage3 from "../assets/images/grid-post-3.jpg";

const blogs = [
    {
        category: "Covid-19",
        title: "What Mutations of SARS-CoV-2 are Causing Concern?",
        description: "The idea that your mental state is interconnected with your physical state is a fundamental concept.",        
        image: blogImage1,
    },
    {
        category: "Dental",
        title: "How Do Your Emotions Affect Your Physical Health?",
        description: "The idea that your mental state is interconnected with your physical state is a fundamental concept.",        
        image: blogImage2,
    },
    {
        category: "Dermatologist",
        title: "Using Flow Cytometry in Protein Engineering Detection",
        description: "The idea that your mental state is interconnected with your physical state is a fundamental concept.",        
        image: blogImage3,
    },
];

const BlogSection = () => {
    return (
        <Container className="text-center my-5">
            <Badge className="pill-button badge rounded-5 bg-light text-dark shadow custom-badge-team-member mb-4">
                Our Post From Blog
            </Badge>
            <h2 className="fw-bold text-dark m-md-5 custom-font display-3 team_sec_cntnt">
                Latest News & Articles
            </h2>
            <Row>
                {blogs.map((blog, index) => (
                    <Col md={4} sm={6} key={index} className="mb-4 d-flex justify-content-center">
                        <Card className="blog-card shadow border-2">                            
                            <div className="image-container">
                                <Card.Img variant="top" src={blog.image} className="blog-image" />
                            </div>
                            <Card.Body className="text-start">
                                <Card.Title className="text-dark-color custom-font">{blog.title}</Card.Title>
                                <Card.Text className="text-muted text-color ">{blog.description}</Card.Text>                                
                                <div className="mt-3">
                                    <Button className="blog_btn mt-3">{blog.category}</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default BlogSection;
