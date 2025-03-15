import React, { useEffect } from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Department from './pages/Department';
import Footer from './components/footer';
import BookOnline from './components/BookOnline';
import AppointmentList from './components/AppointmentList';
import AppointmentHistory from './components/AppointmentHistory';
import ContactSection from './components/ContactSection';
import "./assets/css/main.css";
import { ToastContainer } from "react-toastify";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const ProgressBar = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    NProgress.start();
    setTimeout(() => NProgress.done(), 500);
    return () => {
      NProgress.done();
    };
  }, [location]);

  return null;
};

const App = () => (
  <>
    <ToastContainer position="top-right" autoClose={3000} />
    <BrowserRouter>
      <ProgressBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onlinebook" element={<BookOnline />} />
        <Route path="/appointments" element={<AppointmentList />} />
        <Route path="/appointmenthistory" element={<AppointmentHistory />} />
        <Route path="/contact" element={<ContactSection />} />
        <Route path="/department/:departmentName" element={<Department />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </>
);

ReactDOM.createRoot(document.getElementById('app')).render(<App />);