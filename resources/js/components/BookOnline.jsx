import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Image,
    Spinner,
    Offcanvas,
    Form,
    Pagination,
    Modal
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import HeaderNavbar from "./HeaderNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/main.css";
import errorBgImage from "../assets/images/page-title.jpg";
import defaultImage from "../assets/images/default_dr.jpg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AxiosHook from "../hooks/AxiosInstance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AnimatePresence, motion } from "framer-motion";

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

const BookOnline = () => {
    const navigate = useNavigate();
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [sortColumn, setSortColumn] = useState("id");
    const [sortOrder, setSortOrder] = useState("DESC");
    const [searchBy, setSearchBy] = useState("");
    const [filterBy, setFilterBy] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [doctorsList, setDoctorsList] = useState({});
    const [totalPages, setTotalPages] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());

    useEffect(() => {
        setDoctorsList({});
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
        const URL = `/all-doc-list?${queryParams}`;

        AxiosInstance.get(URL)
            .then((response) => {
                const apiData = response.data;
                if (apiData.valid) {
                    setDoctorsList(apiData.data);
                    setTotalPages(apiData.data.totalPages || 1);
                } else {
                    toast.error(apiData.message);
                }
            })
            .catch((error) => {
                console.error("doctorsList error:", error);
                toast.error("Something went wrong. Please try again later.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [page, perPage, sortColumn, sortOrder, searchBy, filterBy]);

    const handleSearch = () => {
        setSearchBy(searchText);
        setFilterBy(selectedFilter === "all" ? "" : selectedFilter);
        setPage(1);
    };

    const handleShowOffcanvas = (doctor) => {
        setSelectedDoctor(doctor);
        setShowOffcanvas(true);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handlePerPageChange = (e) => {
        setPerPage(parseInt(e.target.value, 10));
        setPage(1);
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
            nextAvailableTime.setHours(now.getHours() + 1, Math.ceil(now.getMinutes() / 15) * 15, 0);
            return nextAvailableTime;
        }
        return new Date().setHours(9, 0, 0);
    };
    
    const submitBooking = () => {
        const AxiosInstance = AxiosHook();
        const URL = "/schedule-appointment";
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
            doctor_id: selectedDoctor.id,
            doctor_name: selectedDoctor.name,
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
                    }, 3000);
                } else {
                    toast.error(apiData.message);
                }
            })
            .catch((error) => {
                console.error("Book Appointment error:", error);
                toast.error("Something went wrong. Please try again later.");
            });
    };
    
    const handleConfirmBooking = () => {
        setShowPaymentModal(true);
    };

    return (
        <>
            <HeaderNavbar />
            <Container
                fluid
                className="py-5 bg-light text-center book_appointment_cstm"
                style={{
                    backgroundImage: `url(${errorBgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <h2 className="text-dark-color custom-font display-4 mt-lg-5">
                    Book Appointment
                </h2>
                <p>
                    <Link to="/" className="text-decoration-none text-dark-color">
                        <span>Home</span>
                    </Link>{" "}
                    / <span>Book Appointment</span>
                </p>
            </Container>
            <Container className="py-4">
                <h2 className="text-dark-color custom-font text-center mb-5">
                    Available Doctors ({doctorsList.totalRecords || 0} doctors)
                </h2>
                <Row>
                    <Col md={3} className="mb-5">
                        <Card className="p-3 shadow-lg">
                            <Form>
                                <Form.Group className="mb-3">
                                    <h5>Search</h5>
                                    <Form.Control
                                        type="text"
                                        placeholder="Type here.."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <h5>Filter By</h5>
                                    <div>
                                        <Form.Check
                                            type="radio"
                                            id="filter-all"
                                            label={<label htmlFor="filter-all">All</label>}
                                            name="filterOptions"
                                            value="all"
                                            checked={selectedFilter === "all"}
                                            onChange={(e) => setSelectedFilter(e.target.value)}
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="filter-name"
                                            label={<label htmlFor="filter-name">Name</label>}
                                            name="filterOptions"
                                            value="name"
                                            checked={selectedFilter === "name"}
                                            onChange={(e) => setSelectedFilter(e.target.value)}
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="filter-specialty"
                                            label={<label htmlFor="filter-specialty">Specialty</label>}
                                            name="filterOptions"
                                            value="specialty"
                                            checked={selectedFilter === "specialty"}
                                            onChange={(e) => setSelectedFilter(e.target.value)}
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="filter-department"
                                            label={<label htmlFor="filter-department">Department</label>}
                                            name="filterOptions"
                                            value="department"
                                            checked={selectedFilter === "department"}
                                            onChange={(e) => setSelectedFilter(e.target.value)}
                                        />
                                    </div>
                                </Form.Group>

                                <Button className="custom-btn w-100" onClick={handleSearch}>
                                    Search
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                    <Col md={9}>
                        {isLoading ? (
                            <div className="text-center">
                                <Spinner animation="border" className="text-dark-color" />
                            </div>
                        ) : (
                            <>
                                <Row>
                                    {doctorsList?.totalRecords ? (
                                        doctorsList.dataArr.map((doctor, index) => (
                                            <Col key={index} md={6} className="mb-4">
                                                <Card className="shadow-lg">
                                                    <Card.Body className="d-flex align-items-center">
                                                        <Image
                                                            src={defaultImage}
                                                            rounded
                                                            className="me-3 img-thumbnail"
                                                            width={80}
                                                            height={80}
                                                        />
                                                        <div className="flex-grow-1">
                                                            <Card.Title className="mb-3">
                                                                {doctor.name}
                                                            </Card.Title>
                                                            <Card.Text className="text-muted mb-0">
                                                                {doctor.specialty}
                                                            </Card.Text>
                                                            <Card.Text className="text-muted">
                                                                {doctor.department}
                                                            </Card.Text>
                                                        </div>
                                                        <Button
                                                            className="custom-btn"
                                                            onClick={() => handleShowOffcanvas(doctor)}
                                                        >
                                                            Book
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))
                                    ) : (
                                        <Col className="text-center">
                                            <Card className="p-4">
                                                <h4 className="text-muted">No doctor available</h4>
                                            </Card>
                                        </Col>
                                    )}
                                </Row>
                            </>
                        )}
                    </Col>
                </Row>
                <Row className="align-items-center">
                    <Col className="d-flex align-items-center col-3">
                        <Form.Label className="me-2 mb-0">Show:</Form.Label>
                        <Form.Select
                            value={perPage}
                            onChange={handlePerPageChange}
                            className="w-auto"
                        >
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </Form.Select>
                    </Col>
                    <Col className="d-flex justify-content-end col-9">
                        <Pagination className="mb-0">
                            <Pagination.First
                                onClick={() => handlePageChange(1)}
                                disabled={page === 1}
                            />
                            <Pagination.Prev
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                            />
                            {page > 2 && <Pagination.Ellipsis disabled />}
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                if (
                                    pageNum === page ||
                                    pageNum === 1 ||
                                    pageNum === totalPages ||
                                    (pageNum >= page - 1 && pageNum <= page + 1)
                                ) {
                                    return (
                                        <Pagination.Item
                                            key={pageNum}
                                            active={pageNum === page}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </Pagination.Item>
                                    );
                                }
                                return null;
                            })}
                            {page < totalPages - 1 && <Pagination.Ellipsis disabled />}
                            <Pagination.Next
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                            />
                            <Pagination.Last
                                onClick={() => handlePageChange(totalPages)}
                                disabled={page === totalPages}
                            />
                        </Pagination>
                    </Col>
                </Row>
            </Container>
            <Offcanvas
                show={showOffcanvas}
                onHide={() => setShowOffcanvas(false)}
                placement="end"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Schedule Appointment</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {selectedDoctor ? (
                        <>
                            <Card className="border-1">
                                <Card.Body className="d-flex align-items-center">
                                    <Image
                                        src={defaultImage}
                                        className="me-3 img-thumbnail rounded-5"
                                        width={80}
                                        height={80}
                                    />
                                    <div className="flex-grow-1">
                                        <Card.Title className="mb-1">{selectedDoctor.name}</Card.Title>
                                        <Card.Text className="text-muted mb-1">
                                            {selectedDoctor.specialty}
                                        </Card.Text>
                                        <Card.Text className="text-muted mb-1">
                                            {selectedDoctor.department}
                                        </Card.Text>
                                    </div>
                                </Card.Body>
                            </Card>
                            <Form.Group className="mt-3">
                                <Form.Label className="fw-bold">Select Date:</Form.Label>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    className="form-control"
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
                                    className="form-control"
                                    minTime={getMinSelectableTime(selectedDate)}
                                    maxTime={new Date().setHours(17, 0, 0)}
                                />
                            </Form.Group>
                            <Button
                                className="mt-3 custom-btn"
                                onClick={handleConfirmBooking}
                            >
                                Confirm Booking
                            </Button>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
            <Modal
                show={showPaymentModal}
                onHide={() => setShowPaymentModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Payment Gateway</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please complete your payment.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowPaymentModal(false);
                            submitBooking();
                        }}
                    >
                        Pay Now
                    </Button>
                </Modal.Footer>
            </Modal>

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
                                Your appointment has been successfully booked.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default BookOnline;
