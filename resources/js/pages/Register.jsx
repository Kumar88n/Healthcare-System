import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Image, Card, Badge, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import HeaderNavbar from "../components/HeaderNavbar";
import auth from "../assets/images/auth.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosHook from "../hooks/AxiosInstance";

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [role, setRole] = useState("patient");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (formData) => {
        const AxiosInstance = AxiosHook();
        setIsLoading(true);
        const URL = "/register";
        formData.role = role;

        AxiosInstance.post(URL, formData)
            .then((response) => {
                const apiData = response.data;
                if (apiData.valid) {
                    localStorage.setItem("authToken", apiData.data.token);
                    toast.success("Registration successful!", { position: "top-right" });
                    navigate("/");
                } else {
                    toast.error(apiData.message, { position: "top-right" });
                }
            })
            .catch((error) => {
                console.error("Registration error:", error);
                toast.error("Something went wrong. Please try again later.", { position: "top-right" });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <HeaderNavbar />
            <Container fluid className="d-flex flex-column min-vh-100">
                <Row className="flex-grow-1 d-flex justify-content-center align-items-center py-4 py-md-5">
                    <Col sm={12} md={6} className="d-none d-md-block p-0">
                        <Image src={auth} alt="Register Illustration" className="w-100 h-100 object-fit-cover" />
                    </Col>
                    <Col sm={12} md={6} className="d-flex justify-content-center">
                        <Card className="p-4 w-md-75 w-lg-50 border-0 shadow-lg">
                            <Badge className="pill-button badge bg-light shadow-sm custom-badge-login mb-4 custom-font">
                                Register
                            </Badge>

                            <Card.Body>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Select Role</Form.Label>
                                        <div className="d-flex">
                                            <Form.Check
                                                type="radio"
                                                label="Patient"
                                                name="role"
                                                value="patient"
                                                checked={role === "patient"}
                                                onChange={() => setRole("patient")}
                                                className="me-3"
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="Doctor"
                                                name="role"
                                                value="doctor"
                                                checked={role === "doctor"}
                                                onChange={() => setRole("doctor")}
                                            />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Floating>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter your name"
                                                {...register("name", { required: "Name is required" })}
                                                isInvalid={!!errors.name}
                                            />
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                                        </Form.Floating>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Floating>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter your email"
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                        message: "Invalid email format",
                                                    },
                                                })}
                                                isInvalid={!!errors.email}
                                            />
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                                        </Form.Floating>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Floating>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter your password"
                                                {...register("password", {
                                                    required: "Password is required",
                                                    minLength: { value: 6, message: "Must be at least 6 characters" },
                                                })}
                                                isInvalid={!!errors.password}
                                            />
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                                        </Form.Floating>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Floating>
                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm your password"
                                                {...register("confirmPassword", {
                                                    required: "Confirm password is required",
                                                    validate: (value, formValues) =>
                                                        value === formValues.password || "Passwords do not match",
                                                })}
                                                isInvalid={!!errors.confirmPassword}
                                            />
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                                        </Form.Floating>
                                    </Form.Group>
                                    <div className="text-center">
                                        <Button type="submit" className="custom-btn" disabled={isLoading}>
                                            {isLoading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" /> Registering...
                                                </>
                                            ) : (
                                                "Register Now"
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                                <Card.Text className="text-center mt-3 text-dark">
                                    Already have an account? <Link to="/login" className="text-color">Login Here</Link>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Register;



