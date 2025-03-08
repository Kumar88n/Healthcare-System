import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Button, Image, Modal, Form, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/images/logo.svg";
import AxiosHook from "../hooks/AxiosInstance";
import { toast } from "react-toastify";
import { FaUser, FaCalendarCheck, FaClipboardList, FaSignOutAlt, FaHospitalUser, FaUserMd, FaDollarSign } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { FaUserLarge } from "react-icons/fa6";
import "../assets/css/main.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaTrash } from "react-icons/fa";
const HeaderNavbar = () => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(window.scrollY);
    const location = useLocation();
    const navigate = useNavigate();

    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const [userName, setUserName] = useState(localStorage.getItem("userName"));
    const [userId, setuserId] = useState(localStorage.getItem("userId"));
    const [userRole, setuserRole] = useState(localStorage.getItem("userRole"));
    const [doctorsUpdate, setDoctorsList] = useState({});

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        doctor_id: "",
        department: "",
        specialty: ""
    });

    useEffect(() => {
        setDoctorsList({});
        const URL = `/all-doc-list?userId=${userId}`;
        const AxiosInstance = AxiosHook();

        AxiosInstance.get(URL)
            .then((response) => {
                const apiData = response.data;
                if (apiData.valid) {
                    setDoctorsList(apiData.data);
                    if (apiData.data.dataArr.length > 0) {
                        const firstDoctor = apiData.data.dataArr[0];
                        setFormData({
                            doctor_id: firstDoctor.id || "",
                            department: firstDoctor.department || "",
                            specialty: firstDoctor.specialty || ""
                        });
                    }
                }
            })
            .catch((error) => {
                console.error("doctorsList error:", error);
                toast.error("Something went wrong. Please try again later.", { position: "top-right" });
            });
    }, [userId]);

    useEffect(() => {
        const handleScroll = () => {
            setShowNavbar(window.scrollY < lastScrollY);
            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        setAuthToken(null);
        setUserName(null);
        setuserId(null);
        setuserRole(null);
        navigate("/");
    };

    const handleProfileOpen = () => setShowProfileModal(true);
    const handleProfileClose = () => setShowProfileModal(false);
    const [errors, setErrors] = useState({});
    const handleProfileSave = () => {
        setErrors({});
        if (!formData.department) {
            setErrors((prevErrors) => ({ ...prevErrors, department: "Department is required" }));
            return;
        }
        setLoading(true);
        const AxiosInstance = AxiosHook();
        const URL = "/update-doc-info";

        AxiosInstance.post(URL, formData)
            .then((response) => {
                const apiData = response.data;
                if (apiData.valid) {
                    toast.success("Update successful!", { position: "top-right" });
                    navigate("/");
                } else {
                    toast.error(apiData.message, { position: "top-right" });
                }
            })
            .catch((error) => {
                console.error("Update error:", error);
                toast.error("Something went wrong. Please try again later.", { position: "top-right" });
            })
            .finally(() => {
                setLoading(false);
                setShowProfileModal(false);
            });
    };

    const hideLoginButton = location.pathname === "/login" || location.pathname === "/register";
    const handleKeyDown = (e) => {
        // Allow control keys for navigation and editing.
        const allowedKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
            "Home",
            "End"
        ];
        if (allowedKeys.includes(e.key)) return;

        // Allow one dot for decimals
        if (e.key === ".") {
            if (e.target.value.includes(".")) {
                e.preventDefault();
            }
            return;
        }

        // Allow numeric digits only
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
            alert("Only numeric values are allowed");
        }
    };
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [schedule, setSchedule] = useState({});
    console.log('schedule', schedule);
    
    const [selectedType, setSelectedType] = useState("regular");

    const addTimeSlot = (day) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: [...(prev[day] || []), { from: null, to: null }],
        }));
    };

    const removeTimeSlot = (day, index) => {
        setSchedule((prev) => {
            const updatedSlots = [...prev[day]];
            updatedSlots.splice(index, 1);
            return { ...prev, [day]: updatedSlots };
        });
    };

    const handleTimeChange = (day, index, field, value) => {
        console.log('day', day);
        console.log('index', index);
        console.log('field', field);
        console.log('value', value);
        
        setSchedule((prev) => {
            const updatedSlots = [...prev[day]];
            updatedSlots[index][field] = value;
            return { ...prev, [day]: updatedSlots };
        });
    };
    return (
        <Navbar expand="sm" className={`custom-navbar ${showNavbar ? "nav-visible" : "nav-hidden"}`}>
            <Container fluid>
                <Navbar.Brand as={Link} to="/">
                    <Image src={logo} alt="Logo" style={{ height: "40px" }} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="mx-auto w-100 justify-content-center">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <NavDropdown title="Department" id="department-dropdown">
                            <NavDropdown.Item as={Link} to="/">Department</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/">Department Single</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
                        <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                {!hideLoginButton && (
                    authToken ? (
                        <>
                            <NavDropdown
                                title={
                                    <Button
                                        variant="custom"
                                        className="rounded-circle fs-4"
                                        style={{
                                            width: "45px",
                                            height: "45px",
                                            backgroundColor: "#6f4ba0",
                                            color: "white",
                                            border: "none",
                                            boxShadow: "none"
                                        }}
                                    >
                                        {(userName && userName.charAt(0).toUpperCase()) || "U"}
                                    </Button>
                                }
                                id="user-dropdown"
                                align="end"
                            >
                                <NavDropdown.Item className="text-muted" disabled>
                                    <FaUserLarge className="me-2" /> Hi, {userName || "User"}
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                {userRole === "doctor" && (
                                    <NavDropdown.Item onClick={handleProfileOpen} className="dropdown-item custom_dropdown_item">
                                        <FaUser className="me-2" /> Profile
                                    </NavDropdown.Item>
                                )}
                                {userRole === "patient" && (
                                    <Link to="/onlinebook" className="dropdown-item custom_dropdown_item">
                                        <FaCalendarCheck className="me-2" /> Book Now
                                    </Link>
                                )}
                                <Link to="/appointments" className="dropdown-item custom_dropdown_item">
                                    <FaClipboardList className="me-2" /> Appointments
                                </Link>
                                <NavDropdown.Item onClick={handleLogout} className="text-danger custom_dropdown_item">
                                    <FaSignOutAlt className="me-2" /> Logout
                                </NavDropdown.Item>
                            </NavDropdown>

                            <Modal show={showProfileModal} onHide={handleProfileClose} className="modal-xl" centered>
                                <Modal.Header closeButton className="border-0">
                                    <Modal.Title className="text-color">
                                        <FaUserMd /> Profile
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {doctorsUpdate.dataArr && doctorsUpdate.dataArr.length > 0 ? (
                                        <Form>
                                            <Form.Floating className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Department"
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                    className={`ps-5 custom-focus ${errors.department ? "is-invalid" : ""}`}
                                                />
                                                <Form.Label>
                                                    <FaHospitalUser className="me-2 text-secondary" /> Department
                                                </Form.Label>
                                                {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                                            </Form.Floating>

                                            <Form.Floating className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Specialty"
                                                    value={formData.specialty}
                                                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                                    className="ps-5 custom-focus"
                                                />
                                                <Form.Label>
                                                    <FaUserMd className="me-2 text-secondary" /> Specialty
                                                </Form.Label>
                                            </Form.Floating>
                                            <Form.Floating className="mb-3">
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Fees"
                                                    value={formData.fees}
                                                    onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                                                    onKeyDown={handleKeyDown}
                                                    className="ps-5 custom-focus"
                                                />
                                                <Form.Label>
                                                    <FaDollarSign className="me-2 text-secondary" /> Fees
                                                </Form.Label>
                                            </Form.Floating>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Schedule Type:</Form.Label>
                                                <div className="d-flex gap-4">
                                                    <Form.Check
                                                        type="radio"
                                                        label="Regular"
                                                        value="regular"
                                                        checked={selectedType === "regular"}
                                                        onChange={(e) => setSelectedType(e.target.value)}
                                                    />
                                                    <Form.Check
                                                        type="radio"
                                                        label="Emergency"
                                                        value="emergency"
                                                        checked={selectedType === "emergency"}
                                                        onChange={(e) => setSelectedType(e.target.value)}
                                                    />
                                                </div>
                                            </Form.Group>
                                            <Row>
                                                {weekdays.map((day) => (
                                                    <Col md={6} key={day} className="mb-3">
                                                        <Card className="shadow-sm border-0">
                                                            <Card.Body>
                                                                <Card.Title className="fw-bold text-secondary">{day}</Card.Title>
                                                                {schedule[day]?.map((slot, index) => (
                                                                    <div key={index} className="d-flex align-items-center gap-2 mb-2">
                                                                        <Form.Group>
                                                                            <Form.Label>From</Form.Label>
                                                                            <DatePicker
                                                                                selected={slot.from}
                                                                                onChange={(date) => handleTimeChange(day, index, "from", date)}
                                                                                showTimeSelect
                                                                                showTimeSelectOnly
                                                                                timeIntervals={15}
                                                                                timeFormat="hh:mm aa"
                                                                                dateFormat="hh:mm aa"
                                                                                className="form-control"
                                                                            />
                                                                        </Form.Group>
                                                                        <Form.Group>
                                                                            <Form.Label>To</Form.Label>
                                                                            <DatePicker
                                                                                selected={slot.to}
                                                                                onChange={(date) => handleTimeChange(day, index, "to", date)}
                                                                                showTimeSelect
                                                                                showTimeSelectOnly
                                                                                timeIntervals={15}
                                                                                timeFormat="hh:mm aa"
                                                                                dateFormat="hh:mm aa"
                                                                                className="form-control"
                                                                            />
                                                                        </Form.Group>
                                                                        <Button variant="danger" size="sm" onClick={() => removeTimeSlot(day, index)}>
                                                                            <FaTrash />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                                <Button variant="success" className="w-100" onClick={() => addTimeSlot(day)}>
                                                                    <FaPlus /> Add Time Slot
                                                                </Button>
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Form>
                                    ) : (
                                        <p className="text-muted text-center">No profile data available.</p>
                                    )}
                                </Modal.Body>
                                <Modal.Footer className="border-0">
                                    <Button onClick={handleProfileClose} className="custom_ani_btn_close">
                                        Close
                                    </Button>
                                    <Button onClick={handleProfileSave} disabled={loading} className="custom_ani_btn">
                                        {loading ? (
                                            <>
                                                <CgSpinner className="spinning-icon" /> Saving...
                                            </>
                                        ) : (
                                            "Save"
                                        )}
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                    ) : (
                        <Button as={Link} to="/login" className="custom_ani_btn">Login</Button>
                    )
                )}
            </Container>
        </Navbar>
    );
};

export default HeaderNavbar;
