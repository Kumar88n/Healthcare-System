import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Image, Spinner, Form, Badge, Offcanvas, Modal, Collapse, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import HeaderNavbar from "./HeaderNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/main.css";
import errorBgImage from "../assets/images/page-title.jpg";
import defaultImage from "../assets/images/schedule.svg";
import AxiosHook from "../hooks/AxiosInstance";
import { FaCalendarAlt, FaUser, FaEdit, FaUserMd, FaHospitalUser, FaStethoscope, FaTimesCircle, FaExclamationTriangle, FaCheckCircle, FaSearch, FaHistory } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { MdDescription } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";
import { CgSpinner } from "react-icons/cg";
import DescImg from "../assets/images/description.svg";
import { useSearchParams } from "react-router-dom";



const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
};

const modalVariants = {
    hidden: { y: 100, opacity: 0, scale: 0.9 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 400, damping: 30 }
    },
    exit: { y: 100, opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
};

const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.2, duration: 0.4 }
    },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } }
};
const AppointmentList = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [sortColumn, setSortColumn] = useState("id");
    const [sortOrder, setSortOrder] = useState("DESC");
    const [searchBy, setSearchBy] = useState("");
    const [filterBy, setFilterBy] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [appointmentsList, setAppointmentsList] = useState({});
    const [reloadData, setReloadData] = useState(null);
    const [searchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);


    const userId = searchParams.get("user_id");

    useEffect(() => {
        fetchAppointments();
    }, [page, perPage, filterBy]);

    const fetchAppointments = () => {
        setIsLoading(true);

        const queryParams = new URLSearchParams({
            page,
            perPage,
            ...(filterBy && { filter_doctor: filterBy }),
            ...(userId && { user_id: userId })
        }).toString();

        const AxiosInstance = AxiosHook();
        AxiosInstance.get(`/appointment-history?${queryParams}`)
            .then((response) => {
                if (response.data.valid) {
                    setAppointmentsList(response.data.data);
                    setDoctors(response.data.data.doctors || []);
                }
            })
            .catch((error) => console.error("Error fetching appointments:", error))
            .finally(() => setIsLoading(false));

};
    const ReadMoreText = ({ text, maxLength = 50 }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const toggleReadMore = () => setIsExpanded(!isExpanded);
        const safeText = typeof text === "string" ? text : "";

        return (
            <>
                <span>{isExpanded ? safeText : `${safeText.slice(0, maxLength)} `}</span>
                {safeText.length > maxLength && (
                    <Button variant="link" className="p-0 text-primary" onClick={toggleReadMore}>
                        {isExpanded ? "Show Less" : "Read More"}
                    </Button>
                )}
            </>
        );
    };

    return (
        <>
            <HeaderNavbar />
            <Container fluid className="py-5 bg-light text-center book_appointment_cstm" style={{ backgroundImage: `url(${errorBgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <h2 className="text-dark-color custom-font display-4 mt-lg-5">Appointments</h2>
                <p>
                    <Link to="/" className="text-decoration-none text-dark-color">
                        <span>Home</span>
                    </Link> / <span>Appointments</span>
                </p>
            </Container>

            <Container className="py-4">
                <h2 className="text-dark-color custom-font text-center mb-5">
                    Appointment History ({appointmentsList.totalRecords || 0})
                </h2>
                <Row className="d-flex justify-content-end">
                    <Col md={2} className="mb-5">
                        <Row className="d-flex align-items-center">
                            <Form.Group controlId="doctorFilter">
                            <Form.Label className="fw-bold">Filter by Doctor:</Form.Label>
                            <Form.Select className="fw-semibold" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}
                            >
                                <option value="">All Doctors</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.doctor_id} value={doctor.doctor_id}>
                                        {doctor.doctor_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        </Row>
                    </Col>


                    <Col md={12}>
                        {isLoading ? (
                            <div className="text-center">
                                <Spinner animation="border" className="text-dark-color" />
                            </div>
                        ) : (
                            <Row>
                                {appointmentsList?.totalRecords ? (
                                    appointmentsList.dataArr.map((appointment, index) => (
                                        <Col key={index} md={4} className="mb-4">
                                            <Card className="shadow-lg border-1 h-100">
                                                <Card.Body>
                                                    <Row>
                                                        <Col md={10}>
                                                            <Card.Text as="h5" className="fw-bold text-dark-color mb-2">
                                                                {appointment.name}
                                                            </Card.Text>
                                                            <Card.Text className="mb-1 text-muted d-flex align-items-center">
                                                                <FaUser className="text-secondary me-2" />
                                                                <strong className="text-dark me-1">Status:</strong>
                                                                <Badge bg={
                                                                    appointment.status === "completed" ? "success" :
                                                                        appointment.status === "canceled" ? "danger" :
                                                                            appointment.status === "scheduled" ? "secondary" :
                                                                                ""
                                                                } text="light"
                                                                    style={appointment.status == "pending" ? { backgroundColor: "#6c63ff" } : {}}
                                                                >
                                                                    {appointment.status}
                                                                </Badge>

                                                            </Card.Text>
                                                            <Card.Text className="mb-1 text-muted d-flex align-items-center">
                                                                <FaCalendarAlt className="text-secondary me-2 " />
                                                                <span>
                                                                    <strong className="text-dark">Schedule:{" "}</strong>
                                                                    {new Date(appointment.schedule).toLocaleString()}
                                                                </span>
                                                            </Card.Text>
                                                            {appointment.doctor?.name && (
                                                                <Card.Text className="mb-1 text-muted d-flex align-items-center">
                                                                    <FaUserMd className="text-secondary me-2 fs-5" />
                                                                    <span>
                                                                        <strong className="text-dark">Doctor:</strong> {appointment.doctor.name} ({appointment.doctor.department})
                                                                    </span>
                                                                </Card.Text>
                                                            )}

                                                            {appointment.doctor?.specialty && (
                                                                <Card.Text className="mb-1 text-muted d-flex align-items-center">
                                                                    <FaStethoscope className="text-secondary me-2 " />
                                                                    <span>
                                                                        <strong className="text-dark">Specialty:</strong>{appointment.doctor.specialty}</span>
                                                                </Card.Text>

                                                            )}

                                                            <Card.Text className="mb-1 text-muted appointDesc">
                                                                <FaUserDoctor className="text-secondary me-2 fs-5" />
                                                                <strong className="text-dark">Doctor:</strong>
                                                                <span>
                                                                    {appointment?.doctor_name ? (
                                                                        <span className="ms-1"><ReadMoreText text={appointment.doctor_name} /></span>
                                                                    ) : (
                                                                        <span className="ms-1">`N`/A</span>
                                                                    )}
                                                                </span>
                                                            </Card.Text>

                                                            <Card.Text className="mb-1 text-muted appointDesc">
                                                                <MdDescription className="text-secondary me-2 fs-5" />
                                                                <strong className="text-dark">Description:</strong>
                                                                <span>
                                                                    {appointment?.description ? (
                                                                        <span className="ms-1"><ReadMoreText text={appointment.description} /></span>
                                                                    ) : (
                                                                        <span className="ms-1">N/A</span>
                                                                    )}
                                                                </span>
                                                            </Card.Text>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col className="text-center">
                                        <Card className="p-4">
                                            <h4 className="text-muted">No Appointments Available</h4>
                                        </Card>
                                    </Col>
                                )}
                            </Row>
                        )}
                    </Col>
                </Row>
            </Container>

        </>
    );
};

export default AppointmentList;
