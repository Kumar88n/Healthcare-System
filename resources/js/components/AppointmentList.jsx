import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Image, Spinner, Form, Badge, Offcanvas, Modal, Collapse, Dropdown  } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import HeaderNavbar from "./HeaderNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/main.css";
import errorBgImage from "../assets/images/page-title.jpg";
import defaultImage from "../assets/images/schedule.svg";
import AxiosHook from "../hooks/AxiosInstance";
import { FaCalendarAlt, FaUser, FaEdit, FaUserMd, FaHospitalUser,  FaStethoscope, FaTimesCircle, FaExclamationTriangle, FaCheckCircle, FaSearch , FaHistory} from "react-icons/fa";
    import { MdDescription } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";
import { CgSpinner } from "react-icons/cg";
import DescImg from "../assets/images/description.svg";


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
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [appointmentsList, setAppointmentsList] = useState({});
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showThankYou, setShowThankYou] = useState(false);
    const [reloadData, setReloadData] = useState(null);
    const [userRole] = useState(localStorage.getItem("userRole"));
    const [description, setDescription] = useState("");
    const [lgShow, setLgShow] = useState(false);
    const [openRecords, setOpenRecords] = useState({});

    // const wordLimit = 20;
    // const words = appointment?.description?.split(" ") || [];
    // const isLongText = words.length > wordLimit;
    // const previewText = words.slice(0, wordLimit).join(" ");



    useEffect(() => {
        setAppointmentsList({});
        setIsLoading(true);

        const queryParams = new URLSearchParams({
            page,
            perPage,
            sortColumn,
            sortOrder,
            ...(searchBy && { searchBy }),
            ...(filterBy && { filterBy })
        }).toString();

        const AxiosInstance = AxiosHook();
        const URL = `/appointments-list?${queryParams}`;

        AxiosInstance.get(URL)
            .then((response) => {
                if (response.data.valid) {
                    setAppointmentsList(response.data.data);
                }
            })
            .catch((error) => console.error("appointmentsList error:", error))
            .finally(() => setIsLoading(false));
    }, [page, perPage, sortColumn, sortOrder, searchBy, filterBy, reloadData]);


    const handleShow = (appointment) => {
        setSelectedAppointment(appointment);
        setSelectedDate(new Date(appointment.schedule));
        setSelectedTime(new Date(appointment.schedule));
        setShowOffcanvas(true);
    };

    const handleClose = () => {
        setShowOffcanvas(false);
        setSelectedAppointment(null);
    };
    const getMinSelectableTime = (date) => {
        const now = new Date();
        const selected = new Date(date);

        if (
            selected.getFullYear() === now.getFullYear() &&
            selected.getMonth() === now.getMonth() &&
            selected.getDate() === now.getDate()
        ) {
            let nextAvailableTime = new Date();
            nextAvailableTime.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0);
            if (nextAvailableTime.getHours() >= 17) {
                return new Date().setHours(17, 0, 0);
            }
            return nextAvailableTime;
        }

        return new Date().setHours(9, 0, 0);
    };

    const updateBooking = () => {
        const AxiosInstance = AxiosHook();
        const URL = "/reschedule-appointment";
        const formatDateTime = (date, time) => {
            const selectedDateTime = new Date(date);
            const [hours, minutes] = [time.getHours(), time.getMinutes()];
            selectedDateTime.setHours(hours, minutes, 0);
            const formattedDate = selectedDateTime.toISOString().split("T")[0];
            const formattedTime = selectedDateTime
                .toTimeString()
                .split(" ")[0]
                .substring(0, 5) + ":00";
            return `${formattedDate} ${formattedTime}`;
        };

        const formattedDateTime = formatDateTime(selectedDate, selectedTime);
        
        const formData = {
            appointment_id: selectedAppointment.id,
            schedule: formattedDateTime
        };

        AxiosInstance.post(URL, formData)
            .then((response) => {
                const apiData = response.data;
                if (apiData.valid) {
                    toast.success(apiData.message);
                    setShowOffcanvas(false);
                    setShowThankYou(true);
                    setTimeout(() => {
                        setShowThankYou(false);
                        navigate("/appointments");
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 3000);
                } else {
                    toast.error(apiData.message);
                }
            })
            .catch((error) => {
                console.error("Appointment Update error:", error);
                toast.error("Something went wrong. Please try again later.");
            }).finally(() => {
                let currentSecondsOnly = new Date().getSeconds();
                setReloadData(currentSecondsOnly)
            });
    };
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [ShowConfirmCompletedModal, setShowConfirmCompletedModal] = useState(false);
    const [ShowHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleCancelClick = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setShowConfirmModal(true);
    };


    const handleConfirmCancel = () => {
        setIsLoading(true);

        const AxiosInstance = AxiosHook();
        const URL = userRole === "patient" ? "/cancel-appointment" : "/update-appointment";
        const formData = {
            appointment_id: selectedAppointmentId,
            status: "canceled"
        };

        AxiosInstance.post(URL, formData)
            .then((response) => {
                const apiData = response.data;
                if (apiData.valid) {
                    toast.success(apiData.message);
                    navigate("/appointments");
                } else {
                    toast.error(apiData.message);
                }
            })
            .catch((error) => {
                console.error("Appointment Update error:", error);
                toast.error("Something went wrong. Please try again later.");
            })
            .finally(() => {
                let currentSecondsOnly = new Date().getSeconds();
                setReloadData(currentSecondsOnly)
                setShowConfirmModal(false);
                setSelectedAppointmentId(null);
                setIsLoading(false);
            });
    };

    const handleCompletedClick = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setShowConfirmCompletedModal(true);
    };

    // const handleHistoryClick = () => {
    //     setIsLoading(true);

    //     const AxiosInstance = AxiosHook();
    //     const URL ="appointment-history";
    //     const formData = {
    //         user_id: selectedUserId,
    //     };

    //     AxiosInstance.post(URL, formData)
    //         .then((response) => {
    //             const apiData = response.data;
    //             console.log(apiData);
    //             if (apiData.valid) {
    //                 toast.success(apiData.message);
    //                 navigate("/appointmenthistory");
    //             } else {
    //                 toast.error(apiData.message);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Appointment Update error:", error);
    //             toast.error("Something went wrong. Please try again later.");
    //         })
    //         .finally(() => {
    //             let currentSecondsOnly = new Date().getSeconds();
    //             setReloadData(currentSecondsOnly)
    //             setShowConfirmModal(false);
    //             setSelectedAppointmentId(null);
    //             setIsLoading(false);
    //         });
    // };

    const handleHistoryClick = (userId) => {
        navigate(`/appointmenthistory?user_id=${userId}`);
    };

    const handleCollapse = (appointmentId) => {
        setOpenRecords((prev) => ({
            ...prev,
            [appointmentId]: !prev[appointmentId]
        }));
    };

    // const handleConfirmComplete = () => {

    //     setIsLoading(true);
    //     const AxiosInstance = AxiosHook();
    //     const URL = "/update-appointment";

    //     const formData = {
    //         appointment_id: selectedAppointmentId,
    //         description: " ",
    //         status: "completed"
    //     };

    //     AxiosInstance.post(URL, formData)
    //         .then((response) => {
    //             const apiData = response.data;
    //             if (apiData.valid) {
    //                 toast.success("Appointment marked as completed!");
    //                 navigate("/appointments");
    //             } else {
    //                 toast.error(apiData.message);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Completion error:", error);
    //             toast.error("Something went wrong. Please try again later.");
    //         })
    //         .finally(() => {
    //             let currentSecondsOnly = new Date().getSeconds();
    //             setReloadData(currentSecondsOnly)
    //             setShowConfirmCompletedModal(false);
    //             setSelectedAppointmentId(null);
    //             setIsLoading(false);
    //         });
    // };

    const handleConfirmComplete = () => {
        
        setIsLoading(true); 
        const AxiosInstance = AxiosHook();
        const URL = "/update-appointment";

        const formData = {
            appointment_id: selectedAppointmentId,
            status: "completed",
            description: description,
        };

        AxiosInstance.post(URL, formData)
            .then((response) => {
                const apiData = response.data;
                if (apiData.valid) {
                    toast.success("Appointment marked as completed!");
                    setShowConfirmCompletedModal(false);
                    setDescription("");
                    navigate("/appointments");
                } else {
                    toast.error(apiData.message);
                }
            })
            .catch((error) => {
                console.error("Completion error:", error);
                toast.error("Something went wrong. Please try again later.");
            })
            .finally(() => {
                let currentSecondsOnly = new Date().getSeconds();
                setReloadData(currentSecondsOnly);
                setShowConfirmCompletedModal(false);
                setSelectedAppointmentId(null);
                setIsLoading(false);
            });
    };

    const handleSearch = () => {
        setSearchBy(searchText);        
        setPage(1);
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
                    Appointment List ({appointmentsList.totalRecords || 0})
                </h2>
                <Row>
                    <Col md={12} className="mb-5">
                        <Row>
                            <Col md={6}>
                                <Card className="p-3 shadow-lg">
                                    <Row>
                                        <Form>
                                            <Form.Floating className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    className="custom-focus"
                                                    placeholder="Search"
                                                    value={searchText}
                                                    onChange={(e) => setSearchText(e.target.value)}
                                                />
                                                <Form.Label>
                                                    <FaSearch className="me-2 text-secondary " /> Search
                                                </Form.Label>
                                            </Form.Floating>
                                            <Button className="custom-btn float-end btn-sm" onClick={handleSearch}>
                                                Submit
                                            </Button>
                                        </Form>
                                    </Row>
                                </Card>
                            </Col>
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
                                        <Col key={index} md={6} className="mb-4">
                                            <Card className="shadow-lg border-1 h-100">
                                                <Card.Body>
                                                    <Row>
                                                        <Col md={3} className="text-center image_2">
                                                            <Image
                                                                src={defaultImage}
                                                                alt="Appointment"
                                                                className="img-fluid rounded"
                                                            />
                                                        </Col>
                                                        <Col md={6}>
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
                                                                    <MdDescription className="text-secondary me-2 fs-5" />
                                                                        <strong className="text-dark">Description:</strong>
                                                                    <span>
                                                                        {appointment?.description ? (
                                                                            <span className="ms-1"><ReadMoreText text={appointment.description} /></span>
                                                                        ):(
                                                                            <span className="ms-1">N/A</span>
                                                                        )}
                                                                    </span>
                                                                </Card.Text>

                                                        </Col>
                                                        {(appointment.status !== "canceled" && appointment.status !== "completed") && (
                                                            <Col md={3} className="text-end">
                                                                {new Date() < new Date(appointment.schedule) && userRole === "patient" && (
                                                                    <>
                                                                        <FaEdit
                                                                            className="text-dark-color me-1"
                                                                            style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                                                            onClick={() => handleShow(appointment)}
                                                                        />
                                                                        <FaTimesCircle
                                                                            className="text-danger"
                                                                            style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                                                            onClick={() => handleCancelClick(appointment.id)}
                                                                        />
                                                                    </>
                                                                )}
                                                                {userRole === "doctor" && (
                                                                    <>
                                                                        {new Date() < new Date(appointment.schedule) && (
                                                                            <FaEdit
                                                                                className="text-dark-color me-1"
                                                                                style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                                                                onClick={() => handleShow(appointment)}
                                                                            />
                                                                        )}
                                                                        <FaCheckCircle
                                                                            className="text-success me-1"
                                                                            style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                                                            onClick={() => handleCompletedClick(appointment.id)}
                                                                        />
                                                                        <FaTimesCircle
                                                                            className="text-danger me-1"
                                                                            style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                                                            onClick={() => handleCancelClick(appointment.id)}
                                                                        />
                                                                    </>
                                                                )}

                                                                {userRole === "doctor" && (
                                                                    <>
                                                                        <FaHistory 
                                                                          className="text-success "
                                                                          style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                                                          onClick={() => handleHistoryClick(appointment.user_id)}
                                                                        />
                                                                    </>
                                                                )}

                                                            </Col>
                                                        )}

                                                        {(appointment.status == "canceled" || appointment.status == "completed") && (
                                                            <Col md={3} className="text-end">
                                                                {userRole === "doctor" && (
                                                                    <>
                                                                        <FaHistory 
                                                                          className="text-success "
                                                                          style={{ cursor: "pointer", fontSize: "1.2rem" }}
                                                                          onClick={() => handleHistoryClick(appointment.user_id)}
                                                                        />
                                                                    </>
                                                                )}

                                                            </Col>
                                                        )}
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
            {/* Confirmation Model */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="text-danger">
                        <FaExclamationTriangle className="me-2" /> Confirm Cancellation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>Are you sure you want to cancel this appointment?</p>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        No, Keep It
                    </Button>
                    <Button variant="danger" onClick={handleConfirmCancel} disabled={isLoading}>
                        {isLoading ? <><CgSpinner className="spinning-icon" /> Cancelling...</> : "Yes, Cancel"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Success Confirmation Model */}
            <Modal
                show={ShowConfirmCompletedModal} size="lg" onHide={() => setShowConfirmCompletedModal(false)} centered
            >
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="text-success d-flex align-items-center">
                        <FaCheckCircle className="me-2" size={22} /> Confirm Completion
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="text-center px-4">
                    <p className="mb-3 fs-5 fw-semibold mb-3 text-dark-color">Are you sure you want to mark this appointment as completed?</p>
                    <Row >

                        <Col md={6} className="col-md-5 image_2">
                            <Image src={DescImg} alt="Appointment Illustration" className="img-fluid rounded" />
                        </Col>

                        <Col md={6} >

                            <Form>
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Enter description..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{ height: '240px' }}
                                        className="ps-5 custom-focus"
                                    />
                                    <Form.Label>
                                        <MdDescription className="me-2 text-secondary" /> Description
                                    </Form.Label>
                                </Form.Floating>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>


                <Modal.Footer className="border-0 d-flex ">
                    <Button
                        variant="secondary"
                        onClick={() => setShowConfirmCompletedModal(false)}
                    >
                        No,Keep it Pending
                    </Button>

                    <Button
                        variant="success"
                        onClick={handleConfirmComplete}
                        disabled={isLoading}
                    >
                        {isLoading ? <><CgSpinner className="spinning-icon" /> Completing...</> : "Yes ,Complete it"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/*Appointment History Model */}

            <Modal
                show={ShowHistoryModal} size="lg" onHide={() => setShowConfirmCompletedModal(false)} centered
            >
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="text-success d-flex align-items-center">
                        <FaCheckCircle className="me-2" size={22} /> Confirm Completion
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="text-center px-4">
                    <p className="mb-3 fs-5 fw-semibold mb-3 text-dark-color">Are you sure you want to mark this appointment as completed?</p>
                    <Row >

                        <Col md={6} className="col-md-5 image_2">
                            <Image src={DescImg} alt="Appointment Illustration" className="img-fluid rounded" />
                        </Col>

                        <Col md={6} >

                            <Form>
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Enter description..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{ height: '240px' }}
                                        className="ps-5 custom-focus"
                                    />
                                    <Form.Label>
                                        <MdDescription className="me-2 text-secondary" /> Description
                                    </Form.Label>
                                </Form.Floating>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>


                <Modal.Footer className="border-0 d-flex ">
                    <Button
                        variant="secondary"
                        onClick={() => setShowConfirmCompletedModal(false)}
                    >
                        No,Keep it Pending
                    </Button>

                    <Button
                        variant="success"
                        onClick={handleConfirmComplete}
                        disabled={isLoading}
                    >
                        {isLoading ? <><CgSpinner className="spinning-icon" /> Completing...</> : "Yes ,Complete it"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Appointment */}
            <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Edit Appointment</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {selectedAppointment && (
                        <Form>
                            {/* <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Patient Name:</Form.Label>
                                <Form.Control type="text" className="custom-focus" value={selectedAppointment.name} />
                            </Form.Group> */}
                            <Form.Group className="mt-3">
                                <Form.Label className="fw-bold">Select Date:</Form.Label>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    className="form-control custom-focus"
                                    minDate={new Date()}
                                />
                            </Form.Group>

                            <Form.Group className="mt-3">
                                <Form.Label className="fw-bold">Select Time:</Form.Label>
                                <DatePicker
                                    selected={selectedTime}
                                    onChange={(time) => setSelectedTime(time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeFormat="HH:mm"
                                    dateFormat="HH:mm"
                                    className="form-control custom-focus"
                                    minTime={getMinSelectableTime(selectedDate)}
                                    maxTime={new Date().setHours(17, 0, 0)}
                                />
                            </Form.Group>

                            <Button className="mt-3 custom-btn w-100" onClick={() => {
                                updateBooking();
                            }}>
                                Update Appointment
                            </Button>
                        </Form>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
            <AnimatePresence>
                {showThankYou && (
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1050
                        }}
                    >
                        <motion.div
                            variants={modalVariants}
                            style={{
                                backgroundColor: "#fff",
                                padding: "2rem",
                                borderRadius: "8px",
                                textAlign: "center",
                                maxWidth: "90%",
                                boxShadow: "0px 5px 15px rgba(0,0,0,0.3)"
                            }}
                        >
                            <motion.h3 variants={textVariants} className="text-success">
                                Thank You!
                            </motion.h3>
                            <motion.p variants={textVariants}>
                                Your appointment has been updated successfully.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AppointmentList;
