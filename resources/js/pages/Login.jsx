import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Image, Card, Badge, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import HeaderNavbar from "../components/HeaderNavbar";
import auth from "../assets/images/auth.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosHook from "../hooks/AxiosInstance";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (formData) => {
    const AxiosInstance = AxiosHook();
    setIsLoading(true);
    const URL = "/login";
    AxiosInstance.post(URL, formData)
      .then((response) => {
        const apiData = response.data;
        if (apiData.valid) {
          localStorage.setItem("authToken", apiData.data.token);
          localStorage.setItem("userName", apiData.data.user.name);
          localStorage.setItem("userId", apiData.data.user.id);
          localStorage.setItem("userRole", apiData.data.user.role);
          toast.success("Login successful!", { position: "top-right" });
          navigate("/");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          toast.error(apiData.message, { position: "top-right" });
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
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
            <Image src={auth} alt="Login Illustration" className="w-100 h-100 object-fit-cover" />
          </Col>
          <Col sm={12} md={6} className="d-flex justify-content-center">
            <Card className="p-4 w-md-75 w-lg-50 border-0 shadow-lg">
              <Badge className="pill-button badge bg-light shadow-sm custom-badge-login mb-4 custom-font">
                Sign In
              </Badge>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
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
                        className="custom-focus"
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
                        className="custom-focus"
                      />
                      <Form.Label>Password</Form.Label>
                      <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                    </Form.Floating>
                  </Form.Group>
                  <div className="text-center">
                    <Button type="submit" className="custom-btn-auth rounded-5 w-100" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" /> Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
                </Form>
                <Card.Text className="text-center mt-3 text-dark">
                  Don't have an account? <Link to="/register" className="text-color">Register Now</Link>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;




